// server/utils/resetScore.js
// 이 파일은 모든 유저의 점수를 초기화하는 기능을 담당합니다.
const db = require('../db');
const updateScoreAndTier = require('./updateScoreAndTier');

async function resetAllScores() {
  const [users] = await db.query(`SELECT user_id, score FROM user_info`);
  for (const user of users) {
    if (user.score > 0) {
      await updateScoreAndTier(user.user_id, -user.score, '연초 점수 초기화');
    }
  }
}
module.exports = resetAllScores;
