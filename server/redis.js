// server/redis.js
const { createClient } = require('redis');
const redis = createClient({ url: 'redis://localhost:6379' });

// 서버 최초 시작할 때 한번만 비동기로 연결
redis.on('error', (err) => console.error('Redis Client Error', err));
(async () => {
  await redis.connect();
  console.log('✅ Redis 연결 성공');
})();

module.exports = redis;
