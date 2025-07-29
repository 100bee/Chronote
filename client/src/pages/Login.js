// src/pages/Login.js
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/login.scss';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // ✅ 로그인 요청 - email로 수정
      const response = await axios.post('http://localhost:3001/api/login', {
        email: form.email,
        password: form.password,
      });

      // ✅ 응답 처리
      const token = response.data.token;
      const nickname = response.data.user.nickname;

      localStorage.setItem('token', token);       // JWT 저장
      localStorage.setItem('nickname', nickname); // 닉네임 저장

      alert(`${nickname}님, 환영합니다!`);
      navigate('/todos'); // ✅ 로그인 후 이동 경로
    } catch (error) {
      const msg = error.response?.data?.message || '서버 오류';
      alert('로그인 실패: ' + msg);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <h1 className="logo">ChroNote</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            name="email"
            placeholder="아이디 또는 이메일"
            value={form.email}
            onChange={handleChange}
          />
          <input
            name="password"
            type="password"
            placeholder="비밀번호"
            value={form.password}
            onChange={handleChange}
          />

          <div className="options">
            <label>
              <input type="checkbox" />
              로그인 상태 유지
            </label>
          </div>

          <button type="submit" className="login-btn">로그인</button>
          <button type="button" className="passkey-btn">구글, 카카오, 네이버 로그인 (추후 구현)</button>
        </form>

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
