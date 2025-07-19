// src/utils/dateUtils.js
export function formatDateKorean(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });
}
// 데이트가 이상하게 표현되는거 이쁘게 바꿔주는 함수