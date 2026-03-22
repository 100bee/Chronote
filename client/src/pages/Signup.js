// src/pages/Signup.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../api/auth';
import '../css/signup.scss';

function Signup() {
  const [form, setForm] = useState({
    email: '', password: '', confirmPassword: '', nickname: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    setLoading(true);
    try {
      await signup(form.email, form.password, form.nickname);
      alert('회원가입 성공! 로그인해주세요.');
      navigate('/login');
    } catch (err) {
      alert('회원가입 실패: ' + (err.response?.data?.message || '서버 오류'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-box">
        <h1 className="logo">ChroNote</h1>
        <form className="signup-form" onSubmit={handleSubmit}>
          <input name="email" placeholder="이메일" onChange={handleChange} required />
          <input name="password" type="password" placeholder="비밀번호" onChange={handleChange} required />
          <input name="confirmPassword" type="password" placeholder="비밀번호 확인" onChange={handleChange} required />
          <input name="nickname" placeholder="닉네임" onChange={handleChange} required />
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? '가입 중...' : '가입 완료'}
          </button>
        </form>
        <div className="links">
          <a href="/login">이미 계정이 있으신가요? 로그인</a>
        </div>
      </div>
    </div>
  );
}

export default Signup;
