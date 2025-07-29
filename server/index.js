require('dotenv').config();

const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const axios = require('axios');
const { sequelize } = require('./models');
const db = require('./db'); // MySQL raw query용
const StudyLog = require('./studyLog.model'); // MongoDB 모델
const ChatRoom = require('./models/ChatRoom'); // MongoDB 모델
const chronoteRoutes = require('./routes/chronote'); // /api 경로 통합 라우터
const todoRoutes = require('./routes/todos'); // 할 일 관련 라우터

// ✅ express 및 서버 초기화
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3001;

// ✅ socket.io 설정
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// ✅ 소켓 연결 처리
io.on('connection', (socket) => {
  console.log('✅ 사용자 소켓 연결됨:', socket.id);

  socket.on('findMatch', async ({ userText }, callback) => {
    console.log('📩 findMatch 요청:', userText);
    try {
      const allRooms = await ChatRoom.find({}, 'roomId title').lean();

      const response = await axios.post('http://localhost:8000/match-group-advanced', {
        user_text: userText,
        chat_rooms: allRooms.map(room => ({
          room_id: room.roomId,
          text: room.title
        })),
        threshold: 0.5
      });

      const data = response.data;

      if (data.best_match_room_id) {
        callback({
          success: true,
          roomId: data.best_match_room_id,
          message: data.message
        });
      } else {
        const newRoom = new ChatRoom({
          roomId: new mongoose.Types.ObjectId().toString(),
          title: userText
        });
        await newRoom.save();

        callback({
          success: true,
          roomId: newRoom.roomId,
          message: data.message || '새 방 생성됨'
        });
      }
    } catch (err) {
      console.error('❌ 매칭 실패:', err.message);
      callback({ success: false, message: '매칭 서버 오류' });
    }
  });
});

// ✅ 미들웨어 설정
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ 라우터 등록
app.use('/api', chronoteRoutes);        // 회원가입, 로그인 등
app.use('/api/todos', todoRoutes);      // 할 일 관련 API

// ✅ Sequelize (MySQL) 연결
sequelize.sync({ force: false })
  .then(() => console.log('✅ Sequelize DB 연결 성공'))
  .catch((err) => console.error('❌ Sequelize DB 연결 실패:', err));

// ✅ MongoDB 연결
mongoose.connect('mongodb://localhost:27017/chronote', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ MongoDB 연결 성공'))
  .catch(err => console.error('❌ MongoDB 연결 실패:', err));

// ✅ study log 저장 API (MongoDB)
app.post('/api/study-logs', async (req, res) => {
  try {
    const newLog = new StudyLog(req.body);
    await newLog.save();
    res.status(201).json(newLog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'MongoDB 저장 오류' });
  }
});

// ✅ study log 조회 API
app.get('/api/study-logs', async (req, res) => {
  try {
    const { user_id, date } = req.query;
    const query = {};
    if (user_id) query.user_id = Number(user_id);
    if (date) query.date = date;
    const logs = await StudyLog.find(query);
    res.json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'MongoDB 조회 오류' });
  }
});

// ✅ 서버 실행
server.listen(PORT, () => {
  console.log(`✅ 서버 실행됨: http://localhost:${PORT}`);
});
