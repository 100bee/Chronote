# pyserver/main.py
# FastAPI 서버 설정 및 기본 엔드포인트 구현

# 실행 방법:
# 1. 터미널에서 'pip install "fastapi[all]" python-dotenv numpy torch sentence-transformers google-generativeai' 실행
# 2. 이 파일이 있는 위치에 .env 파일 생성 후 'GEMINI_API_KEY=YOUR_API_KEY' 추가
# 3. 터미널에서 'uvicorn main:app --host 0.0.0.0 --port 8000' 실행

import os 
import json 
import numpy as np 
import torch
import traceback
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional

# AI Model , library import
from sentence_transformers import SentenceTransformer, util
import google.generativeai as genai

# --- 1. 모델 및 API 키 설정 ---
# venve 설정시 제미나이 API 키 필수 입력 
embedding_model = SentenceTransformer('jhgan/ko-sroberta-multitask')
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY 환경 변수가 설정되지 않았습니다. API 키를 설정해주세요.")
genai.configure(api_key=GEMINI_API_KEY)
gemini_model = genai.GenerativeModel('gemini-1.5-pro-latest') # 모델 이름 확인

# --- 2. 가중치 정의 ---
WEIGHTS = { "main_topic": 0.5, "sub_topic": 0.2, "target": 0.2, "duration": 0.05, "etc": 0.05 }

app = FastAPI()

# server의 index.js 에 portnumber 3001 번으로 되어 있어서 그쪽에 연결 해야 합니다.
origins = [
    "http://localhost:3001",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. 데이터 모델 정의 부분 
#    room id , text 
class ChatRoom(BaseModel):
    room_id: str = Field(..., description="채팅방의 고유 ID")
    text: str = Field(..., description="채팅방의 주제나 설명을 나타내는 텍스트")
    
class MatchRequest(BaseModel):
    user_text: str = Field(..., description="사용자가 입력한 자신의 소개/관심사 텍스트")
    chat_rooms: List[ChatRoom] = Field(..., description="매칭 대상이 될 기존 채팅방 리스트")
    threshold: float = Field(0.5, description="최소 유사도 임계값", ge=0, le=1)

#    실질적으로 index.js에서 텍스트를 받아서 처리 후 방 배정해서 index.js에 다시 보내는 것
class MatchResult(BaseModel):
    best_match_room_id: str | None = Field(description="가장 유사도가 높은 채팅방 ID. 없을 경우 null")
    similarity_score: float | None = Field(description="최고 유사도 점수. 없을 경우 null")
    message: str

# 4. 핵심 AI 함수 
# 제미나에에게 아레의 프롬프트에 따라 텍스트를 전처리, Json으로 다음 함수에 전달 
def get_structured_info_from_gemini(text: str) -> dict:
    prompt = f"""당신은 사용자가 입력한 텍스트를 분석하여 채팅방 매칭에 사용할 핵심 정보를 추출하는 전문가입니다.
사용자의 텍스트를 읽고, 아래에 정의된 JSON 형식에 맞춰 정보를 구조화해주세요.

# JSON 필드 설명:
- "main_topic": 가장 핵심적인 주제 또는 활동 (예: 스터디, 사이드 프로젝트, 맛집 탐방, 운동)
- "sub_topic": 주제에 대한 구체적인 내용 (예: 파이썬, 데이터 분석, 강남역 카페, 주 3회 헬스)
- "target": 원하는 그룹의 대상 (예: 20대 직장인, 초보 개발자, 서울 거주자)
- "duration": 활동 기간이나 빈도 (예: 3개월, 주말마다, 단기)
- "etc": 기타 특이사항

# 규칙:
- 반드시 JSON 형식으로만 응답해야 합니다. 다른 설명은 절대 추가하지 마세요.
- 텍스트에서 해당하는 정보를 찾을 수 없으면, 해당 필드 값은 `null`로 지정하세요.
- 최대한 간결하고 핵심적인 키워드 위주로 추출해주세요.

# 예시 1
- 입력 텍스트: "안녕하세요, 2-3달 정도 주말마다 파이썬으로 사이드 프로젝트 하실 분 구합니다. 저는 백엔드 개발자이고, 데이터 분석 쪽에 관심 많아요."
- 당신의 출력 (JSON):
```json
{{
  "main_topic": "사이드 프로젝트",
  "sub_topic": "파이썬, 데이터 분석",
  "target": "백엔드 개발자",
  "duration": "2-3달, 주말마다",
  "etc": null
}}"""
    try:
        response = gemini_model.generate_content(prompt)
        cleaned_json_str = response.text.strip().replace("```json", "").replace("```", "").strip()
        return json.loads(cleaned_json_str)
    except Exception as e:
        print(f"Gemini 처리 중 오류 발생: {e}")
        return {"main_topic": text, "sub_topic": None, "target": None, "duration": None, "etc": None}


def get_weighted_embedding(structured_info: dict) -> np.ndarray:
    embedding_dim = embedding_model.get_sentence_embedding_dimension()
    final_embedding = np.zeros(embedding_dim)
    total_weight = 0.0

    for key, text in structured_info.items():
        if text and key in WEIGHTS:
            weight = WEIGHTS[key]
            embedding = embedding_model.encode(text)
            final_embedding += embedding * weight
            total_weight += weight

    if total_weight > 0:
        return final_embedding / total_weight
    else:
        original_text = structured_info.get("main_topic", "")
        if original_text:
            return embedding_model.encode(original_text)
        return final_embedding


# --- 6. API 엔드포인트 정의 ---
@app.post("/match-group-advanced", response_model=MatchResult)
def match_group_advanced(request_data: MatchRequest):
    
    # ▼▼▼ [디버깅] 1. 요청 데이터 확인 ▼▼▼
    print("\n" + "="*80)
    print("✅ 새로운 매칭 요청 수신!")
    print(f"  - 사용자 텍스트: {request_data.user_text}")
    print(f"  - 비교할 채팅방 개수: {len(request_data.chat_rooms)}")
    # 첫 3개의 채팅방 정보만 간단히 출력 (너무 많으면 터미널이 지저분해지므로)
    for i, room in enumerate(request_data.chat_rooms[:3]):
        print(f"    - 채팅방 {i+1}: ID={room.room_id}, Text='{room.text}'")
    if len(request_data.chat_rooms) > 3:
        print("    - ... (이하 생략)")
    print("="*80)
    # ▲▲▲ 디버깅 끝 ▲▲▲

    if not request_data.chat_rooms:
        return MatchResult(best_match_room_id=None, similarity_score=None, message="비교할 채팅방이 없습니다.")

    try:
        # 1. 사용자 텍스트 -> 구조화 -> 가중치 임베딩
        print("\n[1/3] 사용자 텍스트 처리 중...")
        structured_user_info = get_structured_info_from_gemini(request_data.user_text)
        print(f"  -> Gemini 추출 (사용자): {structured_user_info}")
        user_embedding = get_weighted_embedding(structured_user_info)
        print("  -> 사용자 임베딩 생성 완료")

        # 2. 모든 채팅방 텍스트에도 동일한 파이프라인 적용 (대칭적 비교)
        print("\n[2/3] 기존 채팅방 텍스트 처리 중...")
        room_embeddings_list = []
        for i, room in enumerate(request_data.chat_rooms):
            print(f"  ({i+1}/{len(request_data.chat_rooms)}) '{room.text}' 처리...")
            structured_room_info = get_structured_info_from_gemini(room.text)
            print(f"    -> Gemini 추출 (채팅방 {i+1}): {structured_room_info}")
            room_embedding = get_weighted_embedding(structured_room_info)
            room_embeddings_list.append(room_embedding)

        room_embeddings = torch.tensor(np.array(room_embeddings_list), dtype=torch.float32)
        print("  -> 모든 채팅방 임베딩 생성 완료")
        
        # 3. 유사도 계산
        print("\n[3/3] 유사도 계산 중...")
        user_embedding_tensor = torch.tensor(user_embedding, dtype=torch.float32).unsqueeze(0)
        cosine_scores = util.cos_sim(user_embedding_tensor, room_embeddings)
        print("  -> 유사도 계산 완료")

        scores = cosine_scores.flatten().cpu().numpy()
        best_match_idx = np.argmax(scores)
        max_score = scores[best_match_idx]

        if max_score >= request_data.threshold:
            matched_room = request_data.chat_rooms[best_match_idx]
            result = MatchResult(best_match_room_id=matched_room.room_id, similarity_score=float(max_score), message=f"매칭 성공: '{matched_room.room_id}' 방과 가장 유사합니다.")
        else:
            result = MatchResult(best_match_room_id=None, similarity_score=float(max_score), message="유사도 임계값을 넘는 적합한 채팅방을 찾지 못했습니다.")

        # ▼▼▼ [디버깅] 2. 최종 응답 데이터 확인 ▼▼▼
        print("\n" + "="*80)
        print("✅ 매칭 결과 생성 완료 및 응답 전송")
        print(f"  - 최고 점수: {result.similarity_score:.4f} (임계값: {request_data.threshold})")
        print(f"  - 가장 유사한 방: '{request_data.chat_rooms[best_match_idx].text}' (인덱스: {best_match_idx})")
        print(f"  - 매칭된 방 ID: {result.best_match_room_id}")
        print(f"  - 전송할 메시지: {result.message}")
        print("="*80 + "\n")
        # ▲▲▲ 디버깅 끝 ▲▲▲
        
        return result
        
    except Exception as e:
        print("="*50)
        print("💥 서버 내부 오류 발생!")
        traceback.print_exc()
        print("="*50)
        raise HTTPException(status_code=500, detail=f"서버 내부 오류 발생: {str(e)}")


# 7. 루트 확인용
@app.get("/")
def read_root():
    return {"message": "🚀 Gemini + ChatRoom 매칭 서버가 실행 중입니다."}
