// src/pages/Login.js
// 로그인 페이지
// 이 페이지는 사용자가 로그인할 수 있는 기능을 제공합니다.
// 사용자는 이메일과 비밀번호를 입력하여 로그인할 수 있으며,
// 로그인 성공 시 알림 메시지가 표시되고 /todos 페이지로 이동합니다.

import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ← 페이지 이동용 훅
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
      const response = await axios.post('http://localhost:3001/login', form);

      // ✅ JWT 토큰 저장
      const token = response.data.token;
      localStorage.setItem('token', token); // 또는 sessionStorage.setItem('token', token);

      alert('로그인 성공!');
<<<<<<< HEAD
      navigate('/todos'); // ← 로그인 성공 시 할 일 페이지로 이동
=======
      navigate('/todos'); // 로그인 성공 시 할 일 페이지로 이동
>>>>>>> fc940715e91f3ede7dcf93ebc2217950a0bbddf6
    } catch (error) {
      alert('로그인 실패');
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
<<<<<<< HEAD
          <a href="/signup">회원가입</a> {/* ← 정확한 경로 적용 */}
=======
          <a href="/signup">회원가입</a>
>>>>>>> fc940715e91f3ede7dcf93ebc2217950a0bbddf6
        </div>
      </div>
    </div>
  );
}

export default Login;
