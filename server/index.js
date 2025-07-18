const express = require('express');
const cors = require('cors');
const app = express();
const db = require('./db');
const PORT = 3001;

app.use(cors());
app.use(express.json());

// User Signup
app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: '이미 등록된 이메일입니다.' });
    }

    await db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [
      name,
      email,
      password
    ]);

    res.status(201).json({ message: '회원가입 성공' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
});

// Get all todos for a user
app.get('/api/todos', async (req, res) => {
    const { user_id } = req.query;
    try {
        const [todos] = await db.query('SELECT * FROM todos WHERE user_id = ? ORDER BY created_at DESC', [user_id]);
        res.status(200).json(todos);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '서버 오류' });
    }
});

// Add a new todo
app.post('/api/todos', async (req, res) => {
    const { user_id, task } = req.body;
    if (!user_id || !task) {
        return res.status(400).json({ message: 'user_id와 task를 모두 제공해야 합니다.' });
    }
    try {
        const [result] = await db.query('INSERT INTO todos (user_id, content) VALUES (?, ?)', [user_id, task]);
        const [newTodo] = await db.query('SELECT * FROM todos WHERE id = ?', [result.insertId]);
        res.status(201).json(newTodo[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '서버 오류' });
    }
});

// Update a todo (e.g., toggle completion)
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

// Delete a todo
app.delete('/api/todos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM todos WHERE id = ?', [id]);
        res.status(204).send(); // No content
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '서버 오류' });
    }
});


app.listen(PORT, () => {
  console.log(`서버 실행됨: http://localhost:${PORT}`);
});