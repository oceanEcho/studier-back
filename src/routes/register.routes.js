const crypto = require('crypto');
const registerRouter = require('express').Router();

const User = require('../models/user.model');

registerRouter.route('/register').post((req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      const user = new User(req.body);
      user.createdAt = new Date().getTime();
      user.password = crypto.createHash('md5').update(req.body.password).digest('hex');
      user
        .save()
        .then((user) => {
          res.send({
            status: 200,
            message: `Пользователь "${user.name}" успешно добавлен`,
          });
        })
        .catch((err) => {
          res.status(400).send('Adding new user failed! Error: ' + err);
        });
    } else {
      res.send({
        status: 409,
        message: 'Пользователь с таким email уже существует',
      });
    }
  });

  const user = new User(req.body);
  user.createdAt = new Date().getTime();
  user.password = crypto.createHash('md5').update(req.body.password).digest('hex');
  user
    .save()
    .then((user) => {
      res.send({
        status: 200,
        message: `Пользователь "${user.name}" успешно добавлен`,
      });
    })
    .catch((err) => {
      res.status(400).send('Adding new user failed! Error: ' + err);
    });
});

module.exports = registerRouter;
