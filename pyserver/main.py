from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

# 1. FastAPI 인스턴스 생성
app = FastAPI()

# 2. CORS 설정
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. 기본 메시지 테스트용 모델
class Message(BaseModel):
    text: str

# 4. 기본 테스트용 엔드포인트
@app.post("/api/chat")
async def chat_with_bot(message: Message):
    user_message = message.text
    print(f"📩 받은 메시지: {user_message}")

    if "안녕" in user_message:
        bot_response = "안녕하세요! 만나서 반갑습니다."
    elif "스터디" in user_message:
        bot_response = f"'{user_message}' 관련 스터디를 찾아볼게요!"
    else:
        bot_response = f"메시지를 잘 받았어요: '{user_message}'"

    return {"bot_response": bot_response}

# 5. 매칭용 모델 정의
class Room(BaseModel):
    room_id: str
    text: str

class MatchRequest(BaseModel):
    user_text: str
    chat_rooms: List[Room]
    threshold: Optional[float] = 0.5

# 6. 매칭 API 엔드포인트
@app.post("/match-group-advanced")
async def match_group_advanced(req: MatchRequest):
    print(f"🔍 매칭 요청: '{req.user_text}'")
    print("📦 채팅방 리스트:", req.chat_rooms)

    # (예시) 유사도가 높은 채팅방이 있다고 가정
    if req.chat_rooms:
        return {
            "best_match_room_id": req.chat_rooms[0].room_id,
            "message": f"'{req.chat_rooms[0].text}' 방과 유사합니다."
        }

    # 아무 방도 없으면 새로 만들어야 함
    return {
        "best_match_room_id": None,
        "message": "유사한 채팅방이 없어 새로 생성이 필요합니다."
    }

# 7. 루트 확인용
@app.get("/")
def read_root():
    return {"message": "🚀 Gemini + ChatRoom 매칭 서버가 실행 중입니다."}
