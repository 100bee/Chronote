// server/routes/scorelog.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// ✅ 최근 점수 변화 10건
router.get('/:user_id', async (req, res) => {
  const userId = req.params.user_id;
  try {
    const [rows] = await db.query(
      `SELECT score_change, reason, created_at
       FROM score_log
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT 10`,
      [userId]
    );
    res.json(rows);
  } catch (err) {
    console.error('점수로그 조회 에러:', err);
    res.status(500).json({ message: '서버 에러' });
  }
});

// ✅ 최근 7일(혹은 N일)간 일별 점수 획득량
router.get('/daily/:user_id', async (req, res) => {
  const userId = req.params.user_id;
  try {
    const [rows] = await db.query(
      `SELECT DATE(created_at) AS date, SUM(score_change) AS daily_score
         FROM score_log
         WHERE user_id = ?
         GROUP BY DATE(created_at)
         ORDER BY date DESC
         LIMIT 7`,
      [userId]
    );
    res.json(rows.reverse()); // 최신→과거를 과거→최신으로 정렬
  } catch (err) {
    console.error('일별 점수로그 에러:', err);
    res.status(500).json({ message: '서버 에러' });
  }
});

module.exports = router;
