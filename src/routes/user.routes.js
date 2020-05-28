const crypto = require('crypto');

const userRouter = require('express').Router();
const User = require('../models/user.model');

userRouter.route('/list').get((req, res) => {
  User.find((err, users) => {
    if (err) {
      console.log(err);
    } else {
      res.json(users);
    }
  });
});

userRouter.route('/:id').get((req, res) => {
  const id = req.params.id;
  User.findById(id, function (err, user) {
    res.json(user);
  });
});

userRouter.route('/:id').put((req, res) => {
  User.findById(req.params.id, (err, user) => {
    if (!user) {
      res.status(404).send('User is not found!');
    } else {
      user.name = req.body.name;
      user.email = req.body.email;
      user.password = req.body.password
        ? crypto.createHash('md5').update(req.body.password).digest('hex')
        : user.password;
      user.save()
        .then(user => {
          res.json('User has been updated!');
        })
        .catch(err => {
          res.status(400).send('Update is not possible!');
        });
    }
  });
});

userRouter.route('/:id').delete((req, res) => {
  User.findById(req.params.id, (err, user) => {
    if (!user) {
      res.status(404).send('User is not found!');
    } else {
      user.delete()
        .then(user => {
          res.json('User has been deleted!');
        })
        .catch(err => {
          res.status(400).send('Delete is not possible!');
        });
    }
  });
});

userRouter.route('/').post((req, res) => {
  const user = new User(req.body);
  user.createdAt = new Date().getTime();
  user.password = crypto.createHash('md5').update(req.body.password).digest('hex');
  user.save()
    .then(user => {
      res.status(200).json('User added successfully!');
    })
    .catch(err => {
      res.status(400).send('Adding new user failed!');
    });
});

module.exports = userRouter;
