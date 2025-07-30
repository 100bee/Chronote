// server/utils/penalty.js
const db = require('../db');
const updateScoreAndTier = require('./updateScoreAndTier');

async function penaltyForInactivity() {
  // 7일 이상 미접속 유저 조회
  const [users] = await db.query(
    `SELECT user_id, score FROM user_info WHERE last_login < DATE_SUB(NOW(), INTERVAL 7 DAY)`
  );
  for (const user of users) {
    await updateScoreAndTier(user.user_id, -10, '7일 미접속 감점');
    // 원하면 알림/로그 추가도 가능
  }
}
module.exports = penaltyForInactivity;
