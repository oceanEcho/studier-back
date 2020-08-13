const jwt = require('jsonwebtoken');
const process = require('process');

const authenticateToken = (req, res, next) => {
  if (process.env.SKIP_AUTH === '1') {
    next();
  }

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).send({
      status: 401,
      message: 'Вы не авторизованы',
    });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).send({
        status: 403,
        message: 'Доступ запрещён',
      });
    }
    req.user = user;
    next();
  });
};

const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '24h' });
};

module.exports = {
  authenticateToken,
  generateAccessToken,
};
