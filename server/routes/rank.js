// server/routes/rank.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// ✅ 내 정보 API (/api/rank/userinfo)
router.get('/userinfo', async (req, res) => {
  // 실제 서비스에서는 req.user.id(로그인 정보) 사용!
  const userId = 1; // 테스트용 (로그인 연동 시 교체)
  try {
    const [[user]] = await db.query(
      `SELECT user_id, nickname, score, tier FROM user_info WHERE user_id = ?`,
      [userId]
    );
    if (!user) return res.status(404).json({ message: '유저 정보 없음' });

    // 다음 티어 계산 (없으면 null)
    const [[nextTier]] = await db.query(
      `SELECT name, min_score FROM rank_tiers WHERE min_score > ? ORDER BY min_score ASC LIMIT 1`,
      [user.score]
    );
    const requiredScore = nextTier ? nextTier.min_score - user.score : 0;

    res.json({
      ...user,
      nextTier: nextTier
        ? {
            name: nextTier.name,
            requiredScore,
            requiredTodos: 3,      // 예시
            requiredAttendance: 5  // 예시
          }
        : null,
    });
  } catch (err) {
    console.error('유저 정보 API 에러:', err);
    res.status(500).json({ message: '서버 에러' });
  }
});

// ✅ 전체 랭킹 API (/api/rank)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT user_id, nickname, score, tier FROM user_info ORDER BY score DESC LIMIT 20`
    );
    res.json(rows);
  } catch (err) {
    console.error('랭킹 API 에러:', err);
    res.status(500).json({ message: '서버 에러' });
  }
});

module.exports = router;
