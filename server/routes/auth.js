// ✅ server/routes/auth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../db');
const bcrypt = require('bcrypt');

// ✅ [회원가입]
router.post('/signup', async (req, res) => {
  const { email, password, nickname } = req.body;

  try {
    console.log('[회원가입 요청]', req.body); // 디버깅용

    // 이메일 중복 체크
    const [existing] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: '이미 존재하는 이메일입니다.' });
    }

    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10);

    // 닉네임이 없다면 기본값 '익명' 설정
    const nicknameToUse = nickname || '익명';

    // 사용자 등록
    await db.execute(
      'INSERT INTO users (email, password, nickname) VALUES (?, ?, ?)',
      [email, hashedPassword, nicknameToUse]
    );

    res.status(201).json({ message: '회원가입 성공' });
  } catch (err) {
    console.error('회원가입 실패:', err);
    res.status(500).json({ message: '서버 에러' });
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

    // ✅ JWT 발급
    const token = jwt.sign(
      { user_id: user.id, nickname: user.nickname },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({ token });
  } catch (err) {
    console.error('로그인 실패:', err);
    res.status(500).json({ message: '서버 에러' });
  }
});

module.exports = router;
