// server/studyLog.route.js
const express = require('express');
const router = express.Router();
const StudyLog = require('./studyLog.model');

router.post('/', async (req, res) => {
  try {
    const newLog = new StudyLog(req.body);
    await newLog.save();
    res.status(201).json(newLog);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save study log' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { user_id, date } = req.query;
    const logs = await StudyLog.find({ user_id, date });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch study logs' });
  }
});

module.exports = router;
