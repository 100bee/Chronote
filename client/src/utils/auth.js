// src/utils/auth.js
// ✅ 인증 관련 유틸리티

export const getToken = () => localStorage.getItem('token');
export const getNickname = () => localStorage.getItem('nickname');
export const getUserId = () => localStorage.getItem('user_id');

export const saveAuth = ({ token, nickname, userId }) => {
  localStorage.setItem('token', token);
  localStorage.setItem('nickname', nickname);
  localStorage.setItem('user_id', userId);
};

export const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('nickname');
  localStorage.removeItem('user_id');
};

export const isLoggedIn = () => !!getToken();
