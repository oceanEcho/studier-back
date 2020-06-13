const subjectRouter = require('express').Router();
const Subject = require('../models/subject.model');

subjectRouter.route('/list').get((req, res) => {
  const {
    user: {
      user: { _id: userId },
    },
  } = req;

  Subject.find({ authorId: userId }, (err, documents) => {
    if (err) {
      console.log(err);
    } else {
      res.json(documents);
    }
  });
});

subjectRouter.route('/:id').get((req, res) => {
  const {
    user: {
      user: { _id: userId },
    },
    params: { id },
  } = req;

  Subject.findById(id, function (err, subject) {
    if (subject.authorId === userId) {
      res.json(subject);
    } else {
      return res.status(403).send({
        status: 403,
        message: 'Forbidden',
      });
    }
  });
});

subjectRouter.route('/:id').put((req, res) => {
  const {
    user: {
      user: { _id: userId },
    },
    params: { id },
  } = req;

  Subject.findById(id, (err, subject) => {
    if (!subject) {
      res.status(404).send('Subject is not found!');
    } else if (subject.authorId === userId) {
      const { name } = req.body;

      subject.name = name;

      subject
        .save()
        .then((subject) => {
          res.json(`Subject ${subject._id} has been updated!`);
        })
        .catch((err) => {
          res.status(400).send('Update is not possible! Error: ' + err);
        });
    } else {
      return res.status(403).send({
        status: 403,
        message: 'Forbidden',
      });
    }
  });
});

subjectRouter.route('/:id').delete((req, res) => {
  const {
    user: {
      user: { _id: userId },
    },
    params: { id },
  } = req;

  Subject.findById(id, (err, subject) => {
    if (!subject) {
      res.status(404).send(`Subject ${subject._id} is not found!`);
    } else if (subject.authorId === userId) {
      subject
        .delete()
        .then((subject) => {
          res.json(`Subject ${subject._id} has been deleted!`);
        })
        .catch((err) => {
          res.status(400).send('Delete is not possible! Error: ' + err);
        });
    } else {
      return res.status(403).send({
        status: 403,
        message: 'Forbidden',
      });
    }
  });
});

subjectRouter.route('/').post((req, res) => {
  const {
    user: {
      user: { _id: userId },
    },
    body: { name },
  } = req;

  Subject.findOne({ name }, function (err, subject) {
    if (subject) {
      res
        .status(409)
        .send({
          status: 409,
          message: 'Subject already exists!',
        })
        .end();
    }
  });

  const subject = new Subject(req.body);

  subject.createdAt = new Date().getTime();
  subject.authorId = userId;

  subject
    .save()
    .then((subject) => {
      res.status(200).json(`Subject ${subject._id} added successfully!`);
    })
    .catch((err) => {
      res.status(400).send({
        status: 400,
        message: 'Adding new subject failed! Error: ' + err,
      });
    });
});

module.exports = subjectRouter;
