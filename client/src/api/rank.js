// src/api/rank.js
import api from './index';

export const getRanking = () =>
  api.get('/api/rank');

export const getUserInfo = () =>
  api.get('/api/rank/userinfo');
