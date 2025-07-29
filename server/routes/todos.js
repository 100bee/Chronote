const express = require('express');
const router = express.Router();
const db = require('../db');
const verifyToken = require('../middleware/verifyToken'); // ✅ JWT 미들웨어

// ✅ GET /api/todos - 로그인한 사용자의 투두 리스트 가져오기
router.get('/', verifyToken, async (req, res) => {
  const userId = req.user.user_id;

  try {
    const [rows] = await db.execute('SELECT * FROM todos WHERE user_id = ?', [userId]);
    res.json(rows);
  } catch (err) {
    console.error('투두 불러오기 실패:', err);
    res.status(500).json({ message: '서버 에러' });
  }
});

// ✅ POST /api/todos - 새로운 투두 추가
router.post('/', verifyToken, async (req, res) => {
  const { content, date } = req.body;
  const userId = req.user.user_id;

  if (!content || !date) {
    return res.status(400).json({ message: 'content와 date는 필수입니다.' });
  }

  try {
    const [result] = await db.execute(
      'INSERT INTO todos (user_id, content, date) VALUES (?, ?, ?)',
      [userId, content, date]
    );

    const newTodo = {
      id: result.insertId,
      user_id: userId,
      content,
      date,
      is_completed: 0,
    };

    console.log('✅ 새 작업 추가됨:', newTodo);
    res.status(201).json(newTodo);
  } catch (err) {
    console.error('작업 추가 실패:', err);
    res.status(500).json({ message: '서버 에러' });
  }
});

// ✅ PUT /api/todos/update-time/:id - 기존 코드 유지
router.put('/update-time/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { start_time, end_time } = req.body;
  const userId = req.user.user_id;

  try {
    const [check] = await db.execute(
      'SELECT * FROM todos WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (check.length === 0) {
      return res.status(403).json({ message: '이 작업은 권한이 없습니다.' });
    }

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

    values.push(id, userId);
    const sql = `UPDATE todos SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`;

    await db.execute(sql, values);

    res.json({ message: '시간 업데이트 완료' });
  } catch (err) {
    console.error('시간 업데이트 실패:', err);
    res.status(500).json({ message: '서버 에러' });
  }
});

module.exports = router;
