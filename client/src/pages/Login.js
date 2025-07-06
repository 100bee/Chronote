// src/pages/Login.js
import axios from 'axios';
import { useState } from 'react';

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
      console.log(response.data); // 필요시 토큰 또는 사용자 정보 저장
    } catch (error) {
      console.error(error);
      alert('로그인 실패');
    }
  };

  return (
    <div style={{ padding: '50px' }}>
      <h1>로그인</h1>
      <form onSubmit={handleSubmit}>
        <input
          name="email"
          placeholder="이메일"
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
        <button type="submit">로그인</button>
      </form>
    </div>
  );
}

export default Login;
