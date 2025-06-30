# main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# 1. FastAPI 인스턴스 생성
app = FastAPI()

# 2. CORS 미들웨어 설정
# React 앱이 실행되는 http://localhost:3000 에서 오는 요청을 허용합니다.

# change this part after actual deployment

origins = [
    "http://localhost:3000",
]


# this could be security issue
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # 모든 HTTP 메소드 허용
    allow_headers=["*"],  # 모든 HTTP 헤더 허용
)

# 3. 데이터 모델 정의 (Pydantic)
# React에서 보낼 메시지의 형식을 정의합니다.
class Message(BaseModel):
    text: str

# 4. API 엔드포인트 생성
@app.post("/api/chat")
async def chat_with_bot(message: Message):
    """
    React에서 보낸 채팅 메시지를 받아 처리하고, 봇의 응답을 반환합니다.
    """
    user_message = message.text
    print(f"받은 메시지: {user_message}") # 서버 터미널에 로그 출력

    # <<<<<<< 여기에 AI 모델 로직이 들어갑니다! >>>>>>>>>
    # 지금은 간단한 규칙 기반 응답을 시뮬레이션합니다.
    if "안녕" in user_message:
        bot_response = "안녕하세요! 만나서 반갑습니다."
    elif "스터디" in user_message:
        bot_response = f"네, '{user_message}' 관련 스터디를 찾아드릴게요! 어떤 스타일을 선호하세요?"
    else:
        bot_response = f"메시지를 잘 받았어요: '{user_message}'"

    # React로 보낼 응답을 JSON 형식으로 반환합니다.
    return {"bot_response": bot_response}