const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  console.log('🧩 Authorization Header:', authHeader);

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.warn('⛔️ 인증 헤더가 잘못됨');
    return res.status(401).json({ message: '토큰이 없습니다. 인증이 필요합니다.' });
  }

  const token = authHeader.split(' ')[1];
  console.log('🔑 추출된 토큰:', token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ JWT 검증 성공:', decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('❌ JWT 검증 실패:', err.message);
    console.error('📦 process.env.JWT_SECRET:', process.env.JWT_SECRET); // 추가 로그
    return res.status(403).json({ message: '유효하지 않은 토큰입니다.' });
  }
}

module.exports = verifyToken;
