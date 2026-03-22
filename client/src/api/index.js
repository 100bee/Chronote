// src/api/index.js

import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ✅ 요청 인터셉터 - 토큰 자동 첨부
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ 응답 인터셉터 - 로그인 API 제외하고 401일 때만 로그아웃
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || '';

    // ✅ 로그인/회원가입 요청은 로그아웃 처리 제외
    const isAuthRequest = url.includes('/api/auth/');

    // ✅ 401(토큰 만료)일 때만 로그아웃, 403은 그냥 에러로 처리
    if (status === 401 && !isAuthRequest) {
      localStorage.clear();
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;