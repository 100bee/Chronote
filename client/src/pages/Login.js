// src/pages/Login.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth';
import { saveAuth } from '../utils/auth';
import '../css/login.scss';

function Login() {
  const [form, setForm] = useState({ user_id: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(form.user_id, form.password);
      // ✅ 서버에서 nickname을 직접 받아와서 저장 (한글 인코딩 문제 없음)
      saveAuth({
        token: res.data.token,
        nickname: res.data.nickname,
        userId: res.data.userId,
      });
      alert(`${res.data.nickname}님, 환영합니다!`);
      navigate('/todos');
    } catch (err) {
      alert('로그인 실패: ' + (err.response?.data?.message || '서버 오류'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <h1 className="logo">ChroNote</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            name="user_id"
            placeholder="이메일"
            value={form.user_id}
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="비밀번호"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? '로그인 중...' : '로그인'}
          </button>
          <button type="button" className="passkey-btn">
            구글, 카카오, 네이버 로그인 (추후 구현)
          </button>
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
