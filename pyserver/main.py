# 📁 C:\chronote\pyserver\main.py

import os
import json
import numpy as np
import torch
import traceback
from datetime import datetime
from typing import List, Optional
from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from dotenv import load_dotenv

from sentence_transformers import SentenceTransformer, util
from openai import OpenAI
from pymongo import MongoClient
from jose import JWTError, jwt

# ✅ .env 로드
load_dotenv()

# --- 1. 모델 및 API 키 설정 ---
embedding_model = SentenceTransformer('jhgan/ko-sroberta-multitask')

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
OPENAI_MODEL = os.environ.get("OPENAI_MODEL", "gpt-4.1-mini")
OPENAI_BASE_URL = os.environ.get("OPENAI_BASE_URL", "https://api.openai.com/v1")

if not OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEY 환경 변수가 설정되지 않았습니다.")

openai_client = OpenAI(
    api_key=OPENAI_API_KEY,
    base_url=OPENAI_BASE_URL
)

# --- 2. MongoDB 연결 ---
MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017")
mongo_client = MongoClient(MONGO_URI)
db = mongo_client["chronote"]
chatroom_collection = db["chatrooms"]
message_collection = db["messages"]

# --- 3. FastAPI 초기화 및 CORS 설정 ---
app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://localhost:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 4. JWT 설정 ---
SECRET_KEY = os.environ.get("JWT_SECRET", "chronote-secret-key-please-change-this-in-production-256bit")
ALGORITHM = os.environ.get("JWT_ALGORITHM", "HS384")  # ✅ Spring Boot와 동일한 알고리즘

def get_current_user_id(request: Request) -> str:
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="JWT 토큰이 없습니다.")
    token = auth_header.split(" ")[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")
        if not user_id:
            raise HTTPException(status_code=401, detail="user_id 없음")
        return user_id
    except JWTError:
        raise HTTPException(status_code=401, detail="토큰이 유효하지 않습니다.")

# --- 5. 가중치 정의 ---
WEIGHTS = {
    "main_topic": 0.5,
    "sub_topic": 0.2,
    "target": 0.2,
    "duration": 0.05,
    "etc": 0.05
}

# --- 6. 데이터 모델 ---
class ChatRoom(BaseModel):
    room_id: str
    text: str

class MatchRequest(BaseModel):
    user_text: str
    chat_rooms: List[ChatRoom]
    threshold: float = Field(0.5, ge=0, le=1)

class MatchResult(BaseModel):
    best_match_room_id: str | None
    similarity_score: float | None
    message: str

class CreateChatRoom(BaseModel):
    roomId: str
    title: str

class ChatMessage(BaseModel):
    roomId: str
    message: str
    timestamp: Optional[datetime] = Field(default_factory=datetime.utcnow)

# --- 7. GPT-4.1 mini 전처리 및 임베딩 ---
def get_structured_info_from_gpt(text: str) -> dict:
    prompt = f"""당신은 사용자가 입력한 텍스트를 분석하여 채팅방 매칭에 사용할 핵심 정보를 추출하는 전문가입니다.
사용자의 텍스트를 읽고, 아래에 정의된 JSON 형식에 맞춰 정보를 구조화해주세요.

# JSON 필드 설명:
- "main_topic": 가장 핵심적인 주제 또는 활동
- "sub_topic": 구체적인 활동
- "target": 대상 그룹
- "duration": 기간
- "etc": 기타

반드시 JSON만 반환하고 다른 텍스트는 포함하지 마세요.

#텍스트:
{text}
"""
    try:
        response = openai_client.chat.completions.create(
            model=OPENAI_MODEL,
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"}
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        print(f"[GPT 오류] {e}")
        return {"main_topic": text, "sub_topic": None, "target": None, "duration": None, "etc": None}

def get_weighted_embedding(structured_info: dict) -> np.ndarray:
    dim = embedding_model.get_sentence_embedding_dimension()
    final = np.zeros(dim)
    total_weight = 0.0

    for key, text in structured_info.items():
        if text and key in WEIGHTS:
            weight = WEIGHTS[key]
            embedding = embedding_model.encode(text)
            final += embedding * weight
            total_weight += weight

    if total_weight > 0:
        return final / total_weight
    else:
        return embedding_model.encode(structured_info.get("main_topic", "") or "")

# --- 8. 채팅방 매칭 ---
@app.post("/match-group-advanced", response_model=MatchResult)
def match_group_advanced(request_data: MatchRequest):
    if not request_data.chat_rooms:
        return MatchResult(best_match_room_id=None, similarity_score=None, message="비교할 채팅방이 없습니다.")

    try:
        structured = get_structured_info_from_gpt(request_data.user_text)
        user_emb = get_weighted_embedding(structured)
        room_texts = [room.text for room in request_data.chat_rooms]
        room_embeddings = embedding_model.encode(room_texts, convert_to_tensor=True)

        user_tensor = torch.tensor(user_emb, dtype=torch.float32)
        cosine_scores = util.cos_sim(user_tensor, room_embeddings)
        scores = cosine_scores.flatten().cpu().numpy()

        best_idx = np.argmax(scores)
        max_score = scores[best_idx]

        if max_score >= request_data.threshold:
            best_room = request_data.chat_rooms[best_idx]
            return MatchResult(
                best_match_room_id=best_room.room_id,
                similarity_score=float(max_score),
                message=f"매칭 성공: {best_room.room_id}"
            )
        else:
            return MatchResult(
                best_match_room_id=None,
                similarity_score=float(max_score),
                message="유사도 임계값을 넘는 방이 없습니다."
            )

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

# --- 9. 채팅방 생성 및 조회 ---
@app.post("/chatrooms")
def create_chatroom(data: CreateChatRoom):
    if chatroom_collection.find_one({"roomId": data.roomId}):
        return JSONResponse(status_code=400, content={"message": "이미 존재하는 roomId입니다."})
    chatroom_collection.insert_one(data.dict())
    return {"message": "채팅방이 생성되었습니다."}

@app.get("/chatrooms")
def get_chatrooms():
    try:
        return list(chatroom_collection.find({}, {"_id": 0}))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/chatrooms/{room_id}")
def get_chatroom_by_id(room_id: str):
    try:
        room = chatroom_collection.find_one({"roomId": room_id}, {"_id": 0})
        if not room:
            raise HTTPException(status_code=404, detail="채팅방을 찾을 수 없습니다.")
        return room
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- 10. 메시지 저장 및 조회 ---
@app.post("/messages")
def save_message(data: ChatMessage, user_id: str = Depends(get_current_user_id)):
    try:
        chat_data = data.dict()
        chat_data["sender"] = user_id
        chat_data["timestamp"] = chat_data["timestamp"].isoformat()
        message_collection.insert_one(chat_data)
        return {"message": "메시지 저장 완료"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/messages/{room_id}")
def get_messages(room_id: str):
    try:
        messages = list(message_collection.find({"roomId": room_id}, {"_id": 0}))
        return messages
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- 11. 루트 확인용 ---
@app.get("/")
def read_root():
    return {"message": "🚀 GPT-4.1 mini + ChatRoom 서버 정상 실행 중"}