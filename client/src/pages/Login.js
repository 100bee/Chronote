// src/pages/Login.js
// ✅ 사용자 로그인 페이지
// user_id와 password를 입력받아 로그인 요청을 보내고, 성공 시 JWT 및 사용자 정보를 저장

import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/login.scss'; // 로그인 전용 스타일

function Login() {
  // ✅ 로그인 입력값 상태 (user_id, password)
  const [form, setForm] = useState({ user_id: '', password: '' });
  const navigate = useNavigate(); // 페이지 이동 훅

  // ✅ 입력값 변경 시 상태 업데이트
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ 로그인 폼 제출 처리
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // ✅ 서버에 로그인 요청 (POST)
      const response = await axios.post('http://localhost:3001/api/login', {
        user_id: form.user_id,
        password: form.password,
      });

      // ✅ 로그인 성공 시 토큰 및 닉네임 저장
      const token = response.data.token;
      const nickname = response.data.user.nickname;

      localStorage.setItem('token', token);        // JWT 저장
      localStorage.setItem('nickname', nickname);  // 닉네임 저장

      alert(`${nickname}님, 환영합니다!`);
      navigate('/todos'); // 오늘 할 일 페이지로 이동
    } catch (error) {
      // ✅ 에러 처리
      const msg = error.response?.data?.message || '서버 오류';
      alert('로그인 실패: ' + msg);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <h1 className="logo">ChroNote</h1>

        {/* ✅ 로그인 입력 폼 */}
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            name="user_id" // 기존 email → user_id로 필드명 변경
            placeholder="아이디 또는 이메일"
            value={form.user_id}
            onChange={handleChange}
          />
          <input
            name="password"
            type="password"
            placeholder="비밀번호"
            value={form.password}
            onChange={handleChange}
          />

          {/* ✅ 로그인 옵션 (체크박스: 추후 기능 연결 가능) */}
          <div className="options">
            <label>
              <input type="checkbox" />
              로그인 상태 유지
            </label>
          </div>

          {/* ✅ 기본 로그인 버튼 */}
          <button type="submit" className="login-btn">로그인</button>

          {/* ✅ 소셜 로그인 버튼 (현재는 기능 없음) */}
          <button type="button" className="passkey-btn">
            구글, 카카오, 네이버 로그인 (추후 구현)
          </button>
        </form>

        {/* ✅ 부가 링크들 */}
        <div className="links">
          <a href="#">비밀번호 찾기</a>
          <a href="#">아이디 찾기</a>
          <a href="/signup">회원가입</a>
        </div>
      </div>
    </div>
  );
}

export default Login;
