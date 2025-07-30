// server/routes/auth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../db');
const bcrypt = require('bcrypt');

// ✅ [회원가입]
router.post('/signup', async (req, res) => {
  const { email, password, nickname } = req.body;

  try {
    const [existing] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: '이미 존재하는 이메일입니다.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const nicknameToUse = nickname || '익명';

    await db.execute(
      'INSERT INTO users (email, password, nickname) VALUES (?, ?, ?)',
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
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);

    if (rows.length === 0) {
      return res.status(401).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
    }

    // ✅ JWT 발급 (7일로 늘림)
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        nickname: user.nickname
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' } // <-- 7일로 만료 연장
    );

    res.json({ token });
  } catch (err) {
    console.error('로그인 실패:', err);
    res.status(500).json({ message: '서버 오류' });
  }
});

module.exports = router;
