// server/routes/rank.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const verifyToken = require('../middleware/verifyToken'); // ✅ JWT 인증 미들웨어

// ✅ 내 정보 API (/api/rank/userinfo) - 인증된 사용자만 접근 가능
router.get('/userinfo', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id; // ✅ JWT 토큰에서 추출한 사용자 ID (user_info 테이블의 id 컬럼)

    const [[user]] = await db.query(
      `SELECT user_id, nickname, score, tier FROM user_info WHERE id = ?`,
      [userId]
    );

    if (!user) {
      return res.status(404).json({ message: '유저 정보 없음' });
    }

    // 다음 티어 계산 (없으면 null 반환)
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
            requiredTodos: 3,      // 예시 데이터
            requiredAttendance: 5  // 예시 데이터
          }
        : null
    });
  } catch (err) {
    console.error('❌ 유저 정보 API 에러:', err);
    res.status(500).json({ message: '서버 에러' });
  }
});

// ✅ 전체 랭킹 API (/api/rank) - 누구나 접근 가능
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT user_id, nickname, score, tier FROM user_info ORDER BY score DESC LIMIT 20`
    );
    res.json(rows);
  } catch (err) {
    console.error('❌ 랭킹 API 에러:', err);
    res.status(500).json({ message: '서버 에러' });
  }
});

module.exports = router;
