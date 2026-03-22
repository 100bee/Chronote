// src/api/attendance.js
import api from './index';

export const checkAttendance = () =>
  api.post('/api/attendance');

export const getAttendance = () =>
  api.get('/api/attendance');

export const getMonthlyAttendance = () =>
  api.get('/api/attendance/monthly');
