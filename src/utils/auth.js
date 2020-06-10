const jwt = require('jsonwebtoken');
const process = require('process');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).send({
      status: 401,
      message: 'Unauthorized',
    });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).send({
        status: 403,
        message: 'Forbidden',
      });
    }
    req.user = user;
    next();
  });
};

const generateAccessToken = (email) => {
  return jwt.sign(email, process.env.JWT_SECRET, { expiresIn: '30m' });
};

module.exports = {
  authenticateToken,
  generateAccessToken,
};
