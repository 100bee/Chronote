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


-- 수정 (2025-07-29): 사용자 정보 테이블에 추가 컬럼
-- 시작시간, 끝나는 시간 등 추가해서 
-- 얼만큼 Todo를 수행했는지 계산
-- 나중에 init 정리 한 번 해야함
ALTER TABLE user_info
ADD COLUMN birthdate DATE NULL,
ADD COLUMN phone_number VARCHAR(20) NULL;
DESCRIBE user_info;
ALTER TABLE user_info ADD COLUMN birthdate DATE NULL;
ALTER TABLE todo ADD COLUMN start_time DATETIME;ALTER TABLE todo ADD COLUMN end_time DATETIME;
ALTER TABLE todo
ADD COLUMN duration INT DEFAULT 0;
ALTER TABLE todo
ADD COLUMN is_started TINYINT(1) DEFAULT 0 AFTER content;


--랭크 페이지를 위한 추가
ALTER TABLE user_info ADD COLUMN score INT DEFAULT 0;
ALTER TABLE user_info ADD COLUMN tier VARCHAR(20);
ALTER TABLE user_info ADD COLUMN last_login DATETIME;

CREATE TABLE rank_tiers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(20) NOT NULL,
  min_score INT NOT NULL,
  max_score INT,
  color VARCHAR(20),     -- ex: '#B8B8B8'
  icon VARCHAR(50)       -- ex: 'gold.png'
);

INSERT INTO rank_tiers (name, min_score, max_score, color, icon) VALUES
('Bronze', 0, 100, '#A66E41', 'bronze.png'),
('Silver', 101, 300, '#B8B8B8', 'silver.png'),
('Gold', 301, 500, '#F2C94C', 'gold.png'),
('Platinum', 501, 1000, '#60DAFB', 'platinum.png'),
('Diamond', 1001, NULL, '#79E1E8', 'diamond.png');

CREATE TABLE score_log (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  score_change INT,            -- 변화량(+/-)
  reason VARCHAR(50),          -- 사유
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE attendance_log (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  date DATE,  -- 출석한 날짜 (YYYY-MM-DD)
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
