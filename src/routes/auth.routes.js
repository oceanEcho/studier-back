const crypto = require('crypto');
const authRouter = require('express').Router();

const User = require('../models/user.model');
const { generateAccessToken } = require('../utils/auth');

authRouter.post('/login', (req, res) => {
  const { body: { email, password } } = req;

  User.findOne({
    email: email
  }).then(user => {
    if (!user) {
      res.statusMessage = 'Such user does not exist';
      res.status(404).end();
    } else {
      if (crypto.createHash('md5').update(password).digest('hex') === user.password) {
        const token = generateAccessToken({ user });
        res.json(token);
      } else {
        res.statusMessage = 'Current password does not match';
        res.status(400).end();
      }
    }
  });
});

module.exports = authRouter;