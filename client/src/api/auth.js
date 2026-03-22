// src/api/auth.js
import api from './index';

export const login = (email, password) =>
  api.post('/api/auth/login', { email, password });

export const signup = (email, password, nickname) =>
  api.post('/api/auth/signup', { email, password, nickname });
