// src/pages/Signup.js
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/signup.scss';

function Signup() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    nickname: '',
    birth: '',
    gender: '',
    nationality: '',
    phone: ''
  });

  const navigate = useNavigate();

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
      await axios.post('http://localhost:3001/api/signup', {
        user_id: form.email,
        password: form.password,
        name: form.name,
        nickname: form.nickname,
        birth_date: form.birth,
        gender: form.gender,
        nationality: form.nationality,
        phone_number: form.phone
      });

      alert('회원가입 성공! 로그인해주세요.');
      navigate('/login');
    } catch (err) {
      alert('회원가입 실패: ' + (err.response?.data?.message || '서버 오류'));
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
          <input name="name" placeholder="이름" onChange={handleChange} />
          <input name="nickname" placeholder="닉네임" onChange={handleChange} />
          <input name="birth" placeholder="생년월일 (예: 1999-01-01)" onChange={handleChange} />

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
