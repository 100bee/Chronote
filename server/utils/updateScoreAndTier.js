// server/utils/updateScoreAndTier.js
const db = require('../db');

async function updateScoreAndTier(userId, scoreChange, reason = '') {
  // ✅ 숫자형 PK인 id 기준으로 갱신
  await db.query(`UPDATE user_info SET score = score + ? WHERE id = ?`, [scoreChange, userId]);

  const [[user]] = await db.query(`SELECT score FROM user_info WHERE id = ?`, [userId]);

  const [[tier]] = await db.query(
    `SELECT name FROM rank_tiers WHERE min_score <= ? AND (max_score IS NULL OR max_score >= ?) ORDER BY min_score DESC LIMIT 1`,
    [user.score, user.score]
  );

  await db.query(`UPDATE user_info SET tier = ? WHERE id = ?`, [tier.name, userId]);

  await db.query(
    `INSERT INTO score_log (user_id, score_change, reason) VALUES (?, ?, ?)`,
    [userId, scoreChange, reason]
  );
}

module.exports = updateScoreAndTier;
