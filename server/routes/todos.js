<<<<<<< HEAD
// server/routes/todos.js
// PUT 요청으로 특정 todo의 시작/완료 시간 업데이트
router.put('/update-time/:id', async (req, res) => {
=======
const express = require('express');
const router = express.Router();
const db = require('../db');
const verifyToken = require('../middleware/verifyToken'); // ✅ JWT 미들웨어 import

// ✅ PUT 요청으로 특정 todo의 시작/완료 시간 업데이트 (인증 필요)
router.put('/update-time/:id', verifyToken, async (req, res) => {
>>>>>>> fc940715e91f3ede7dcf93ebc2217950a0bbddf6
  const { id } = req.params;
  const { start_time, end_time } = req.body;
  const userId = req.user.user_id; // ✅ 로그인한 사용자 ID

  try {
    // 1. 먼저 해당 todo가 사용자의 것인지 확인
    const [check] = await db.execute(
      'SELECT * FROM todos WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (check.length === 0) {
      return res.status(403).json({ message: '이 작업은 권한이 없습니다.' });
    }

    // 2. 업데이트할 필드 준비
    const fields = [];
    const values = [];

    if (start_time) {
      fields.push('start_time = ?');
      values.push(start_time);
    }
    if (end_time) {
      fields.push('end_time = ?');
      values.push(end_time);
    }

    if (fields.length === 0) {
      return res.status(400).json({ message: '업데이트할 시간이 없습니다.' });
    }

    values.push(id, userId); // ✅ id와 userId 함께 사용
    const sql = `UPDATE todos SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`;

    await db.execute(sql, values);

    res.json({ message: '시간 업데이트 완료' });
  } catch (err) {
    console.error('시간 업데이트 실패:', err);
    res.status(500).json({ message: '서버 에러' });
  }
});

module.exports = router;
