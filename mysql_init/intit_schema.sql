-- ✅ 데이터베이스 생성 및 선택
CREATE DATABASE IF NOT EXISTS chronote;
USE chronote;

-- ✅ user_info: 사용자 정보 테이블
CREATE TABLE IF NOT EXISTS user_info (
  id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(16) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(50) NOT NULL,
  birth_date DATE DEFAULT NULL,
  phone_number VARCHAR(20) DEFAULT NULL,
  nickname VARCHAR(50) DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  score INT(11) DEFAULT 0,
  tier VARCHAR(20) DEFAULT NULL,
  last_login DATETIME DEFAULT NULL
);

-- ✅ todos: 할 일 테이블
CREATE TABLE IF NOT EXISTS todos (
  id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id INT(11) NOT NULL,
  content TEXT NOT NULL,
  is_started TINYINT(1) DEFAULT 0,
  is_completed TINYINT(1) DEFAULT 0,
  is_shared TINYINT(1) DEFAULT 0,
  due_date DATETIME DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  start_time DATETIME DEFAULT NULL,
  end_time DATETIME DEFAULT NULL,
  duration INT(11) DEFAULT 0
);

-- ✅ rank_tiers: 랭크 티어 정의 테이블
CREATE TABLE IF NOT EXISTS rank_tiers (
  id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(20) NOT NULL,
  min_score INT(11) NOT NULL,
  max_score INT(11) DEFAULT NULL,
  color VARCHAR(20) DEFAULT NULL,
  icon VARCHAR(50) DEFAULT NULL
);

-- ✅ score_log: 점수 변동 로그
CREATE TABLE IF NOT EXISTS score_log (
  id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id INT(11),
  score_change INT(11),
  reason VARCHAR(50),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ✅ attendance_log: 출석 로그
CREATE TABLE IF NOT EXISTS attendance_log (
  id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id INT(11),
  date DATE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ✅ group_member: 그룹 멤버 테이블
CREATE TABLE IF NOT EXISTS group_member (
  id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  group_id INT(11) NOT NULL,
  user_id INT(11) NOT NULL,
  joined_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ✅ rank_tiers 초기 데이터 삽입
INSERT INTO rank_tiers (name, min_score, max_score, color, icon) VALUES
  ('Bronze', 0, 100, '#A66E41', 'bronze.png'),
  ('Silver', 101, 300, '#B8B8B8', 'silver.png'),
  ('Gold', 301, 500, '#F2C94C', 'gold.png'),
  ('Platinum', 501, 1000, '#60DAFB', 'platinum.png'),
  ('Diamond', 1001, NULL, '#79E1E8', 'diamond.png');

-- ✅ 테스트용 유저 데이터 삽입
INSERT INTO user_info (user_id, password, name, nickname, score, tier)
VALUES
  ('1', 'pw1', 'Bronze',   'Bronze유저',   10,   'Bronze'),
  ('2', 'pw2', 'Silver',   'Silver유저',   150,  'Silver'),
  ('3', 'pw3', 'Gold',     'Gold유저',     400,  'Gold'),
  ('4', 'pw4', 'Platinum', 'Platinum유저', 700,  'Platinum'),
  ('5', 'pw5', 'Diamond',  'Diamond유저',  1500, 'Diamond')
ON DUPLICATE KEY UPDATE
  nickname = VALUES(nickname),
  score = VALUES(score),
  tier = VALUES(tier);
