// src/pages/Login.js
import axios from 'axios';
import { useState } from 'react';
import '../css/login.scss';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/login', form);
      alert('로그인 성공!');
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
          <button type="button" className="passkey-btn">미정</button>
        </form>

        <div className="links">
          <a href="#">비밀번호 찾기</a>
          <a href="#">아이디 찾기</a>
          <a href="#">회원가입</a>
        </div>
      </div>
    </div>
  );
}

export default Login;
