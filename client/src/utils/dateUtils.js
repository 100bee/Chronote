// src/utils/dateUtils.js

export const getTodayKey = () =>
  new Date().toISOString().split('T')[0];

export const formatDateKorean = (dateStr) => {
  const date = new Date(dateStr);
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
};
