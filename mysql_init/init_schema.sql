
# 테스트할때 이거 그대로 실행하면 됩니다.
USE chronote;

CREATE TABLE IF NOT EXISTS todos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  content VARCHAR(255) NOT NULL,
  is_started BOOLEAN DEFAULT FALSE,
  is_completed BOOLEAN DEFAULT FALSE,
  start_time DATETIME,
  end_time DATETIME,
  duration INT
);

-- MySQL에 접속해서 실행
SELECT user, host FROM mysql.user;

-- chronote_user 계정 생성 (비밀번호: 1234)
CREATE USER 'chronote_user'@'localhost' IDENTIFIED BY '1234';

-- chronote 데이터베이스에 대한 모든 권한 부여
GRANT ALL PRIVILEGES ON chronote.* TO 'chronote_user'@'localhost';

-- 권한 적용
FLUSH PRIVILEGES;

ALTER TABLE todos
ADD created_at DATETIME DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE todos
ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP;

SHOW CREATE TABLE todos;
DESC todos;

USE chronote;
ALTER TABLE todos ADD COLUMN date DATE;

ALTER TABLE todos
ADD COLUMN start_time DATETIME,
ADD COLUMN end_time DATETIME,
ADD COLUMN duration INT;  -- 단위: 초

ALTER TABLE todos
ADD COLUMN start_time TIME NULL,
ADD COLUMN end_time TIME NULL;

ALTER TABLE todos
MODIFY COLUMN start_time DATETIME NULL;

ALTER TABLE todos
MODIFY COLUMN end_time DATETIME NULL;