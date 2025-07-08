// src/pages/Signup.js
import { useState } from 'react';
import '../css/signup.scss';

function Signup() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    birth: '',
    gender: '',
    nationality: '',
    phone: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    alert("가입 완료!");
    // TODO: 가입 처리 로직 (ex. axios.post 등)
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
