// server/studyLog.model.js
const mongoose = require('mongoose');

const studyLogSchema = new mongoose.Schema({
  user_id: { type: Number, required: true },
  subject: { type: String, required: true },
  date: { type: String, required: true },
  start_time: { type: String, required: true },
  end_time: { type: String, required: true },
  content: { type: String }
});

module.exports = mongoose.model('StudyLog', studyLogSchema);
