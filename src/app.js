const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const crypto = require('crypto');

const User = require('./models/user.model');

dotenv.config();

const routes = require('./routes');

const app = express();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) {
    return res.sendStatus(401);
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};

const generateAccessToken = (email) => {
  return jwt.sign(email, process.env.JWT_SECRET, { expiresIn: '30m' });
};

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));

mongoose.connect('mongodb://127.0.0.1:27017/studier', {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

const connection = mongoose.connection;

connection.once('open', function () {
  console.log('MongoDB database connection established successfully.');
});

app.post('/login', (req, res) => {
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

app.use('/user', authenticateToken, routes.user);
app.use('/document', authenticateToken, routes.document);

const APP_HOST = process.env.HOST || '127.0.0.1';
const APP_PORT = process.env.PORT || 4000;

app.listen(APP_PORT, APP_HOST, () => {
  console.log(`Server is running on  ${APP_HOST}:${APP_PORT}.`);
});