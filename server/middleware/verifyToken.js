// server/middleware/verifyToken.js
const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: '토큰이 없습니다. 인증이 필요합니다.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // 이후 라우트에서 req.user로 사용자 정보 접근 가능
    next(); // 통과 시 다음 미들웨어 or 컨트롤러로 이동
  } catch (err) {
    return res.status(403).json({ message: '유효하지 않은 토큰입니다.' });
  }
}

module.exports = verifyToken;
