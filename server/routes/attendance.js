// server/routes/attendance.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const verifyToken = require('../middleware/verifyToken');
const updateScoreAndTier = require('../utils/updateScoreAndTier');

router.post('/check', verifyToken, async (req, res) => {
  const userId = req.user?.id;
  const today = new Date().toISOString().split('T')[0];

  if (!userId) return res.status(401).json({ message: '로그인 필요' });

  try {
    // 오늘 이미 출석했는지 체크
    const [existing] = await db.query(
      'SELECT * FROM attendance_log WHERE user_id = ? AND date = ?',
      [userId, today]
    );
    if (existing.length > 0)
      return res.status(400).json({ message: '오늘 이미 출석함' });

    // 출석 기록
    await db.query('INSERT INTO attendance_log (user_id, date) VALUES (?, ?)', [userId, today]);

    // 점수 기본 지급
    await updateScoreAndTier(userId, 5, '출석');

    // 연속 출석 일수 계산
    const [[row]] = await db.query(`
      SELECT MAX(date) as last
      FROM attendance_log
      WHERE user_id = ?
    `, [userId]);

    // 연속 출석 일수 구하기
    const [[{ streak }]] = await db.query(`
      SELECT COUNT(*)+1 as streak
      FROM (
        SELECT a.date, DATEDIFF(a.date, 
          LAG(a.date, 1, DATE_SUB(a.date, INTERVAL 1 DAY)) 
          OVER (ORDER BY a.date)) as diff
        FROM attendance_log a
        WHERE a.user_id = ?
      ) t
      WHERE t.diff = 1
    `, [userId]);

    // 보너스 점수 지급 (3/5/7일)
    if (streak === 3) await updateScoreAndTier(userId, 15, '연속 3일 출석 보너스');
    if (streak === 5) await updateScoreAndTier(userId, 25, '연속 5일 출석 보너스');
    if (streak === 7) await updateScoreAndTier(userId, 35, '연속 7일 출석 보너스');

    res.json({ message: `출석 완료! (연속 ${streak}일)`, streak });
  } catch (err) {
    console.error('❌ 출석 처리 실패:', err);
    res.status(500).json({ message: '서버 에러' });
  }
});

module.exports = router;
