-- 📌 Chronote 프로젝트 초기 스키마 설정

-- ✅ 1. 사용할 데이터베이스 선택
CREATE DATABASE IF NOT EXISTS chronote;
USE chronote;

-- ✅ 2. users 테이블 생성 (회원 정보)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  nickname VARCHAR(255) NOT NULL DEFAULT '익명',
  name VARCHAR(100) DEFAULT NULL,
  birthdate DATE DEFAULT NULL,
  phone_number VARCHAR(20) DEFAULT NULL,
  score INT DEFAULT 0,
  tier VARCHAR(20),
  last_login DATETIME DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ✅ 3. todos 테이블 생성 (할 일 기록)
CREATE TABLE IF NOT EXISTS todos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  content VARCHAR(255) NOT NULL,
  is_started BOOLEAN DEFAULT FALSE,
  is_completed BOOLEAN DEFAULT FALSE,
  start_time DATETIME DEFAULT NULL,
  end_time DATETIME DEFAULT NULL,
  duration INT DEFAULT 0,
  date DATE DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ✅ 4. 채팅 메시지 로그 테이블
CREATE TABLE IF NOT EXISTS chat_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  room_id VARCHAR(100) NOT NULL,
  sender VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ✅ 5. 랭크 티어 테이블
CREATE TABLE IF NOT EXISTS rank_tiers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(20) NOT NULL,
  min_score INT NOT NULL,
  max_score INT,
  color VARCHAR(20),         -- 예: '#F2C94C'
  icon VARCHAR(50)           -- 예: 'gold.png'
);

-- ✅ 6. 점수 변화 로그 테이블
CREATE TABLE IF NOT EXISTS score_log (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  score_change INT,
  reason VARCHAR(50),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ✅ 7. 출석 로그 테이블
CREATE TABLE IF NOT EXISTS attendance_log (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  date DATE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ✅ 8. 랭크 티어 데이터 초기 삽입
INSERT INTO rank_tiers (name, min_score, max_score, color, icon) VALUES
  ('Bronze', 0, 100, '#A66E41', 'bronze.png'),
  ('Silver', 101, 300, '#B8B8B8', 'silver.png'),
  ('Gold', 301, 500, '#F2C94C', 'gold.png'),
  ('Platinum', 501, 1000, '#60DAFB', 'platinum.png'),
  ('Diamond', 1001, NULL, '#79E1E8', 'diamond.png');

-- ✅ 9. 테스트용 사용자 데이터 (중복 방지)
INSERT INTO users (id, email, password, nickname, name, score, tier)
VALUES
  (1, 'bronze@test.com', 'pw1', 'Bronze유저', 'Bronze', 10, 'Bronze'),
  (2, 'silver@test.com', 'pw2', 'Silver유저', 'Silver', 150, 'Silver'),
  (3, 'gold@test.com', 'pw3', 'Gold유저', 'Gold', 400, 'Gold'),
  (4, 'platinum@test.com', 'pw4', 'Platinum유저', 'Platinum', 700, 'Platinum'),
  (5, 'diamond@test.com', 'pw5', 'Diamond유저', 'Diamond', 1500, 'Diamond')
ON DUPLICATE KEY UPDATE
  nickname = VALUES(nickname),
  score = VALUES(score),
  tier = VALUES(tier);
