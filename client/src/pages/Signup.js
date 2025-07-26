import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/signup.scss';

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',           // nickname으로 전송
    birth: '',
    gender: '',
    nationality: '',
    phone: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      // ✅ 1. 회원가입 요청
      await axios.post('http://localhost:3001/signup', {
        email: form.email,
        password: form.password,
        nickname: form.name // name → nickname으로 전송
      });

      // ✅ 2. 자동 로그인
      const loginRes = await axios.post('http://localhost:3001/login', {
        email: form.email,
        password: form.password
      });

      // ✅ 3. JWT 토큰 저장
      const token = loginRes.data.token;
      localStorage.setItem('token', token);

      alert("회원가입 및 로그인 완료!");
      navigate('/todos');
    } catch (err) {
      if (err.response?.status === 400) {
        alert(err.response.data.message);
      } else {
        alert("회원가입 실패. 서버 오류가 발생했습니다.");
        console.error(err);
      }
    }
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-box">
        <h1 className="logo">ChroNote</h1>
        <form className="signup-form" onSubmit={handleSubmit}>
          <input name="email" placeholder="아이디 또는 이메일" onChange={handleChange} />
          <input name="password" type="password" placeholder="비밀번호" onChange={handleChange} />
          <input name="confirmPassword" type="password" placeholder="비밀번호 확인" onChange={handleChange} />
          <input name="name" placeholder="닉네임" onChange={handleChange} />
          <input name="birth" placeholder="생년월일 8자리 (예: 19990101)" onChange={handleChange} />

          <div className="selector">
            <select name="gender" onChange={handleChange} defaultValue="">
              <option value="" disabled>성별 선택</option>
              <option value="male">남자</option>
              <option value="female">여자</option>
            </select>
            <select name="nationality" onChange={handleChange} defaultValue="">
              <option value="" disabled>국적 선택</option>
              <option value="korean">내국인</option>
              <option value="foreigner">외국인</option>
            </select>
          </div>

          <input name="phone" placeholder="휴대전화번호" onChange={handleChange} />

          <button type="submit" className="submit-btn">가입 완료</button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
