// server/routes/todos.js
// PUT 요청으로 특정 todo의 시작/완료 시간 업데이트
router.put('/update-time/:id', async (req, res) => {
  const { id } = req.params;
  const { start_time, end_time } = req.body;

  try {
    const fields = [];
    const values = [];

    if (start_time) {
      fields.push('start_time = ?');
      values.push(start_time);
    }
    if (end_time) {
      fields.push('end_time = ?');
      values.push(end_time);
    }

    if (fields.length === 0) {
      return res.status(400).json({ message: '업데이트할 시간이 없습니다.' });
    }

    values.push(id);
    const sql = `UPDATE todos SET ${fields.join(', ')} WHERE id = ?`;

    await db.execute(sql, values);

    res.json({ message: '시간 업데이트 완료' });
  } catch (err) {
    console.error('시간 업데이트 실패:', err);
    res.status(500).json({ message: '서버 에러' });
  }
});
