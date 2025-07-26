-- ✅ 1. 데이터베이스 선택 (미리 생성되어 있다고 가정)
USE chronote;

-- ✅ 2. users 테이블 생성
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  nickname VARCHAR(255) NOT NULL DEFAULT '익명',
  name VARCHAR(100) DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ✅ 3. todos 테이블 생성
CREATE TABLE IF NOT EXISTS todos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  content VARCHAR(255) NOT NULL,
  is_started BOOLEAN DEFAULT FALSE,
  is_completed BOOLEAN DEFAULT FALSE,
  start_time DATETIME DEFAULT NULL,
  end_time DATETIME DEFAULT NULL,
  duration INT DEFAULT NULL,      -- 단위: 초
  date DATE DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ✅ 4. 외래 키 연결 (사용자 삭제 시 할 일도 삭제됨)
ALTER TABLE todos
  ADD CONSTRAINT fk_user_id
  FOREIGN KEY (user_id) REFERENCES users(id)
  ON DELETE CASCADE;

