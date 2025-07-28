// server/consumer.js
require('dotenv').config();
const redis = require('redis');
const mongoose = require('mongoose');
const Message = require('./models/Message');

// ✅ MongoDB 연결
mongoose.connect('mongodb://localhost:27017/chronote', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ MongoDB connected (consumer)'))
  .catch(err => console.error('❌ MongoDB error:', err));

// ✅ Redis Subscriber
const subscriber = redis.createClient(); // 기본 포트 사용
subscriber.connect().then(() => {
  console.log('✅ Redis subscriber connected');
});

// ✅ 메시지 수신 핸들러
subscriber.subscribe('chat', async (msg) => {
  const { roomId, sender, message } = JSON.parse(msg);

  console.log(`📩 저장 요청: [${roomId}] ${sender}: ${message}`);

  const newMessage = new Message({ roomId, sender, message });
  await newMessage.save();
});
