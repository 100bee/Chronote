-- 📌 Chronote 프로젝트 초기 스키마 설정

-- ✅ 1. 사용할 데이터베이스 선택
USE chronote;

-- ✅ 2. users 테이블 생성
-- 회원 정보를 저장 (이메일, 암호화된 비밀번호, 닉네임 등)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  nickname VARCHAR(255) NOT NULL DEFAULT '익명',
  name VARCHAR(100) DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ✅ 3. todos 테이블 생성
-- 사용자별 할 일을 저장하며, 시작/완료 시간 및 총 소요 시간 추적
CREATE TABLE IF NOT EXISTS todos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,                            -- 외래 키: users.id
  content VARCHAR(255) NOT NULL,                   -- 할 일 내용
  is_started BOOLEAN DEFAULT FALSE,                -- 시작 여부
  is_completed BOOLEAN DEFAULT FALSE,              -- 완료 여부
  start_time DATETIME DEFAULT NULL,                -- 시작 시간
  end_time DATETIME DEFAULT NULL,                  -- 종료 시간
  duration INT DEFAULT NULL,                       -- 소요 시간(초)
  date DATE DEFAULT NULL,                          -- 해당 날짜
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP    -- 생성 시각
);

-- ✅ 4. 외래 키 연결
-- 사용자가 삭제되면 해당 사용자의 할 일도 함께 삭제
ALTER TABLE todos
  ADD CONSTRAINT fk_user_id
  FOREIGN KEY (user_id) REFERENCES users(id)
  ON DELETE CASCADE;

-- ✅ 5. 채팅 메시지 로그 저장용 테이블
-- 실시간 채팅 메시지를 저장하여 이후 조회/분석 가능
CREATE TABLE IF NOT EXISTS chat_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  room_id VARCHAR(100) NOT NULL,                   -- 채팅방 고유 ID
  sender VARCHAR(100) NOT NULL,                    -- 보낸 사람 닉네임 또는 ID
  message TEXT NOT NULL,                           -- 메시지 본문
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP    -- 메시지 전송 시각
);

-- ✅ 참고: Redis는 메모리 기반이므로 별도의 MySQL 테이블을 만들지 않음.
-- 하지만 Redis를 통해 pub/sub으로 실시간 처리를 하고,
-- 이 테이블에 저장하여 로그로 남기면 된다.
