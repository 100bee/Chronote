// server/chatsocket.js
const Message = require('./models/Message');
const ChatRoom = require('./models/ChatRoom');
const redis = require('./redis');

/**
 * socket.io 인스턴스를 받아서 채팅 이벤트 처리
 * @param {Server} io - socket.io server instance
 */
module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('✅ 사용자 소켓 연결됨:', socket.id);

    // 1. 채팅방 입장
    socket.on('joinRoom', async (roomId) => {
      try {
        socket.join(roomId);
        // Redis에서 최근 50개 메시지 가져오기 (camelCase: lRange)
        const cachedMsgs = await redis.lRange(`room:${roomId}:messages`, -50, -1);
        let messages = cachedMsgs.map(JSON.parse);

        if (messages.length === 0) {
          // Redis 캐시가 비어있으면 MongoDB에서 조회해서 Redis에 채움
          messages = await Message.find({ roomId }).sort({ timestamp: -1 }).limit(50).lean();
          // 최신순으로 들어오기 때문에 reverse() 필요
          messages = messages.reverse();
          for (const msg of messages) {
            await redis.rPush(`room:${roomId}:messages`, JSON.stringify(msg));
          }
        }

        socket.emit('chatHistory', messages); // 프론트로 메시지 기록 전송
      } catch (err) {
        console.error('❌ joinRoom 에러:', err);
        socket.emit('error', { message: '채팅방 입장 오류' });
      }
    });

    // 2. 메시지 송신
    socket.on('sendMessage', async ({ roomId, sender, message }) => {
      try {
        const msgObj = { roomId, sender, message, timestamp: new Date() };

        // 1. MongoDB 저장
        const savedMsg = await Message.create(msgObj);

        // 2. Redis에 push (최신 100개 유지) (camelCase: rPush, lTrim)
        await redis.rPush(`room:${roomId}:messages`, JSON.stringify(savedMsg));
        await redis.lTrim(`room:${roomId}:messages`, -100, -1);

        // 3. 같은 방의 모든 유저에게 메시지 브로드캐스트
        io.to(roomId).emit('newMessage', savedMsg);
      } catch (err) {
        console.error('❌ sendMessage 에러:', err);
        socket.emit('error', { message: '메시지 전송 오류' });
      }
    });

    // 3. 채팅방 나가기 (선택사항)
    socket.on('leaveRoom', (roomId) => {
      socket.leave(roomId);
      // 필요하면 로그, 푸시 알림 등 처리
    });

    // 4. 기타 예외처리
    socket.on('disconnect', () => {
      // 사용자 연결 종료시 처리
      // (로그아웃 등 필요하다면)
    });
  });
};
