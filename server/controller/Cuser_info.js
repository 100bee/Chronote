// server/controller/Cuser_info.js
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const { User_info } = require("../models");

const SECRET_KEY = "ROOT1234"; 

// JWT 토큰 생성 함수
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      user_id: user.user_id,
      nickname: user.nickname,
    },
    SECRET_KEY,
    { expiresIn: "1h" }
  );
};

// 로그인
exports.userLogin = async (req, res) => {
  try {
    const { user_id, password } = req.body;
    const user = await User_info.findOne({
      where: {
        user_id,
        password,
      },
    });

    if (user) {
      const token = generateToken(user);
      res.status(200).json({ token, user });
    } else {
      res.status(401).json({ message: "아이디 또는 비밀번호가 올바르지 않습니다." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
};

// 회원가입
exports.userRegister = async (req, res) => {
  try {
    const { user_id, password, name, nickname, birth_date, phone_number } = req.body;

    const existingUser = await User_info.findOne({ where: { user_id } });
    if (existingUser) {
      return res.status(409).json({ message: "이미 존재하는 ID입니다." });
    }

    const newUser = await User_info.create({
      user_id,
      password,
      name,
      nickname,
      birth_date,
      phone_number,
    });

    res.status(201).json({ message: "회원가입 성공", user: newUser });
  } catch (err) {
    console.error('[회원가입 실패]', err); 
    res.status(500).json({ message: '회원가입 중 서버 오류' });
  }
};

// 토큰 유효성 확인 미들웨어 (필요 시 라우터에서 사용)
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "토큰이 없습니다." });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "유효하지 않은 토큰입니다." });
  }
};

// 닉네임 중복 확인
exports.checkUserName = async (req, res) => {
  try {
    const { nickname } = req.body;
    const user = await User_info.findOne({ where: { nickname } });
    res.status(200).json({ available: !user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "닉네임 확인 오류" });
  }
};

// ID 중복 확인
exports.checkUserId = async (req, res) => {
  try {
    const { user_id } = req.body;
    const user = await User_info.findOne({ where: { user_id } });
    res.status(200).json({ available: !user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "ID 확인 오류" });
  }
};