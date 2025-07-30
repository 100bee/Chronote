// server/routes/todos.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const verifyToken = require('../middleware/verifyToken');

// ✅ GET /api/todos - 날짜별 투두 리스트 가져오기 (필터 추가)
router.get('/', verifyToken, async (req, res) => {
  const userId = req.user?.id;
  const { date } = req.query;

  if (!userId) {
    return res.status(401).json({ message: 'user_id가 없습니다. (토큰 만료 또는 잘못된 토큰)' });
  }

  try {
    let rows;
    if (date) {
      [rows] = await db.execute(
        'SELECT * FROM todo WHERE user_id = ? AND DATE(due_date) = ?',
        [userId, date]
      );
    } else {
      [rows] = await db.execute('SELECT * FROM todo WHERE user_id = ?', [userId]);
    }
    res.json(rows);
  } catch (err) {
    console.error('❌ 투두 불러오기 실패:', err.message);
    res.status(500).json({ message: '서버 에러' });
  }
});

// ✅ POST /api/todos
router.post('/', verifyToken, async (req, res) => {
  const { content, date } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'user_id가 없습니다. (토큰 만료 또는 잘못된 토큰)' });
  }

  if (!content || !date) {
    return res.status(400).json({ message: 'content와 date는 필수입니다.' });
  }

  try {
    const [result] = await db.execute(
      'INSERT INTO todo (user_id, content, due_date) VALUES (?, ?, ?)',
      [userId, content, date]
    );

    const newTodo = {
      id: result.insertId,
      user_id: userId,
      content,
      due_date: date,
      is_completed: 0,
      duration: 0,
    };

    res.status(201).json(newTodo);
  } catch (err) {
    console.error('❌ 작업 추가 실패:', err.message);
    res.status(500).json({ message: '서버 에러', error: err.message });
  }
});

// ✅ PATCH /api/todos/:id/start - 시작 시간 기록
router.patch('/:id/start', verifyToken, async (req, res) => {
  const todoId = req.params.id;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'user_id가 없습니다. (토큰 만료 또는 잘못된 토큰)' });
  }

  try {
    await db.execute(
      'UPDATE todo SET is_started = 1, start_time = NOW() WHERE id = ? AND user_id = ?',
      [todoId, userId]
    );
    res.json({ message: '시작 시간 기록 완료' });
  } catch (err) {
    console.error('❌ 시작 시간 기록 실패:', err.message);
    res.status(500).json({ message: '서버 에러' });
  }
});

// ✅ PATCH /api/todos/:id/complete - 완료 처리 및 종료 시간+duration 기록
router.patch('/:id/complete', verifyToken, async (req, res) => {
  const todoId = req.params.id;
  const userId = req.user?.id;
  const { duration } = req.body;

  if (!userId) {
    return res.status(401).json({ message: 'user_id가 없습니다. (토큰 만료 또는 잘못된 토큰)' });
  }

  try {
    await db.execute(
      'UPDATE todo SET is_completed = 1, end_time = NOW(), duration = ? WHERE id = ? AND user_id = ?',
      [duration ?? 0, todoId, userId]
    );
    res.json({ message: '완료 처리 및 종료 시간 기록 완료' });
  } catch (err) {
    console.error('❌ 완료 시간 기록 실패:', err.message);
    res.status(500).json({ message: '서버 에러' });
  }
});

// ✅ DELETE /api/todos/:id - 할 일 삭제
router.delete('/:id', verifyToken, async (req, res) => {
  const todoId = req.params.id;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'user_id가 없습니다. (토큰 만료 또는 잘못된 토큰)' });
  }

  try {
    await db.execute('DELETE FROM todo WHERE id = ? AND user_id = ?', [todoId, userId]);
    res.json({ message: '할 일 삭제 완료' });
  } catch (err) {
    console.error('❌ 삭제 실패:', err.message);
    res.status(500).json({ message: '서버 에러' });
  }
});

module.exports = router;
