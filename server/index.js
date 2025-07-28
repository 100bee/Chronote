// ✅ 기본 모듈
const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const db = require('./db');
const StudyLog = require('./studyLog.model');
const axios = require('axios'); // FastAPI 호출용

// ✅ 서버 설정
const app = express();
const server = http.createServer(app); // socket.io 통합을 위한 http server
const PORT = 3001;

// ✅ socket.io 연결
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// ✅ 소켓 연결 핸들링
io.on('connection', (socket) => {
  console.log('✅ 사용자 소켓 연결됨:', socket.id);

  socket.on('findMatch', async ({ userText }, callback) => {
    console.log('📩 findMatch 요청:', userText);

    try {
      const ChatRoom = require('./models/ChatRoom');
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

// ✅ 미들웨어
app.use(cors());
app.use(express.json());

// ✅ MongoDB 연결
mongoose.connect('mongodb://localhost:27017/chronote', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// ✅ API
app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) return res.status(409).json({ message: '이미 등록된 이메일입니다.' });
    await db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, password]);
    res.status(201).json({ message: '회원가입 성공' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [users] = await db.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
    if (users.length === 0) return res.status(401).json({ message: '로그인 실패' });
    const { password: _, ...userWithoutPassword } = users[0];
    res.status(200).json({ message: '로그인 성공', user: userWithoutPassword });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
});

app.get('/api/todos', async (req, res) => {
  const { user_id, date } = req.query;
  try {
    let sql = 'SELECT * FROM todos WHERE user_id = ?';
    const params = [user_id];
    if (date) {
      sql += ' AND date = ?';
      params.push(date);
    }
    sql += ' ORDER BY created_at DESC';
    const [todos] = await db.query(sql, params);
    res.status(200).json(todos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
});

app.post('/api/todos', async (req, res) => {
  const { user_id, task, date } = req.body;
  if (!user_id || !task) return res.status(400).json({ message: 'user_id와 task를 모두 제공해야 합니다.' });
  try {
    const insertQuery = 'INSERT INTO todos (user_id, content, date) VALUES (?, ?, ?)';
    const [result] = await db.query(insertQuery, [user_id, task, date]);
    const [newTodo] = await db.query('SELECT * FROM todos WHERE id = ?', [result.insertId]);
    res.status(201).json(newTodo[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
});

app.patch('/api/todos/:id/start', async (req, res) => {
  const { id } = req.params;
  const now = new Date();
  try {
    await db.query('UPDATE todos SET start_time = ? WHERE id = ?', [now, id]);
    res.status(200).json({ message: 'Start time recorded' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
});

app.patch('/api/todos/:id/complete', async (req, res) => {
  const { id } = req.params;
  const now = new Date();
  try {
    const [rows] = await db.query('SELECT start_time FROM todos WHERE id = ?', [id]);
    if (!rows[0].start_time) return res.status(400).json({ message: '시작 시간이 기록되지 않았습니다.' });
    const start = new Date(rows[0].start_time);
    const duration = Math.floor((now - start) / 1000);
    await db.query('UPDATE todos SET end_time = ?, duration = ?, is_completed = 1 WHERE id = ?', [now, duration, id]);
    res.status(200).json({ message: '완료 시간과 소요 시간 저장 완료' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
});

app.put('/api/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { is_completed } = req.body;
  try {
    await db.query('UPDATE todos SET is_completed = ? WHERE id = ?', [is_completed, id]);
    const [updatedTodo] = await db.query('SELECT * FROM todos WHERE id = ?', [id]);
    res.status(200).json(updatedTodo[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
});

app.delete('/api/todos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM todos WHERE id = ?', [id]);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
});

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
