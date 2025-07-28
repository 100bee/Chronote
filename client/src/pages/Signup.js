<<<<<<< HEAD
// src/pages/Signup.js
// 회원가입 페이지
// 이 페이지는 사용자가 회원가입을 할 수 있는 기능을 제공합니다.
// 사용자는 이메일, 비밀번호, 이름, 생년월일, 성별, 국적, 휴대전화번호를 입력하여 회원가입을 진행할 수 있습니다.
// 입력된 정보는 API를 통해 서버로 전송되며, 회원가입이 완료되면 알림 메시지가 표시됩니다.
// 회원가입 폼은 기본적인 유효성 검사를 포함하고 있습니다.
// 사용자가 비밀번호와 비밀번호 확인이 일치하지 않을 경우 알림 메시지를 표시합니다.
import { useState } from 'react'; // React의 useState 훅을 사용하여 상태를 관리합니다.
import '../css/signup.scss'; // 회원가입 페이지의 스타일을 적용하기 위한 CSS 파일을 import 합니다.

function Signup() {// Signup 컴포넌트 정의
=======
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/signup.scss';

function Signup() {
  const navigate = useNavigate();

>>>>>>> fc940715e91f3ede7dcf93ebc2217950a0bbddf6
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
