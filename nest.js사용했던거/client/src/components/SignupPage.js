// src/components/SignupPage.js
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SignupPage() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/auth/signup', form);
      navigate('/login');
    } catch (error) {
      console.error(error);
      alert('회원가입 실패');
    }
  };

  return (
    <div>
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="이름" value={form.username} onChange={handleChange} required />
        <input type="email" name="email" placeholder="이메일" value={form.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="비밀번호" value={form.password} onChange={handleChange} required />
        <button type="submit">가입하기</button>
      </form>
    </div>
  );
}

export default SignupPage;
