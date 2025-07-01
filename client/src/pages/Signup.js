import axios from 'axios';
import { useState } from 'react';

function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/signup', form);
      alert('회원가입 성공!');
    } catch (error) {
      console.error(error);
      alert('회원가입 실패');
    }
  };

  return (
    <div style={{ padding: '50px' }}>
      <h1>회원가입</h1>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="이름" value={form.name} onChange={handleChange} />
        <input name="email" placeholder="이메일" value={form.email} onChange={handleChange} />
        <input name="password" type="password" placeholder="비밀번호" value={form.password} onChange={handleChange} />
        <button type="submit">가입하기</button>
      </form>
    </div>
  );
}

export default Signup;