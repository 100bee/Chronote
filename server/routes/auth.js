const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../db');
const bcrypt = require('bcrypt');

// ✅ [회원가입]
router.post('/signup', async (req, res) => {
  const { email, password, nickname } = req.body;

  try {
    // ✅ 중복 확인
    const [existing] = await db.execute('SELECT * FROM user_info WHERE user_id = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: '이미 존재하는 이메일입니다.' });
    }

    // ✅ 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);
    const nicknameToUse = nickname || '익명';

    // ✅ user_info에 INSERT
    await db.execute(
      'INSERT INTO user_info (user_id, password, nickname) VALUES (?, ?, ?)',
      [email, hashedPassword, nicknameToUse]
    );

    res.status(201).json({ message: '회원가입 성공' });
  } catch (err) {
    console.error('회원가입 실패:', err);
    res.status(500).json({ message: '서버 오류' });
  }
});

// ✅ [로그인]
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // ✅ user_info에서 사용자 조회
    const [rows] = await db.execute('SELECT * FROM user_info WHERE user_id = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    const user = rows[0];

    // ✅ 비밀번호 확인
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
    }

    // ✅ JWT 발급 (user_info의 id, user_id, nickname 포함)
    const token = jwt.sign(
      {
        id: user.id,               // 숫자형 PK
        user_id: user.user_id,     // 로그인용 아이디 (이메일)
        nickname: user.nickname    // 닉네임
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token });
  } catch (err) {
    console.error('로그인 실패:', err);
    res.status(500).json({ message: '서버 오류' });
  }
});

module.exports = router;
