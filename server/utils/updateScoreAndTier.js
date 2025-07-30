// server/utils/updateScoreAndTier.js
const db = require('../db');

async function updateScoreAndTier(userId, scoreChange, reason = '') {
  await db.query(`UPDATE user_info SET score = score + ? WHERE user_id = ?`, [scoreChange, userId]);
  const [[user]] = await db.query(`SELECT score FROM user_info WHERE user_id = ?`, [userId]);
  const [[tier]] = await db.query(
    `SELECT name FROM rank_tiers WHERE min_score <= ? AND (max_score IS NULL OR max_score >= ?) ORDER BY min_score DESC LIMIT 1`,
    [user.score, user.score]
  );
  await db.query(`UPDATE user_info SET tier = ? WHERE user_id = ?`, [tier.name, userId]);
  await db.query(
    `INSERT INTO score_log (user_id, score_change, reason) VALUES (?, ?, ?)`,
    [userId, scoreChange, reason]
  );
}
module.exports = updateScoreAndTier;
