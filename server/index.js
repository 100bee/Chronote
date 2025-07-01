const express = require('express');
const cors = require('cors');
const app = express();
const db = require('./db');
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: '이미 등록된 이메일입니다.' });
    }

    await db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [
      name,
      email,
      password
    ]);

    res.status(201).json({ message: '회원가입 성공' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
});

app.listen(PORT, () => {
  console.log(`서버 실행됨: http://localhost:${PORT}`);
});
