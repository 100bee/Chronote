// src/api/match.js
import api from './index';

export const findMatch = (userText) =>
  api.post('/api/match', { userText });
