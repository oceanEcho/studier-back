const { createWriteStream, unlink, access } = require('fs');
const { F_OK } = require('constants');

const documentRouter = require('express').Router();

const Document = require('../models/document.model');
const Subject = require('../models/subject.model');

documentRouter.route('/list').get((req, res) => {
  const {
    user: {
      user: { _id: userId },
    },
    query: { count },
  } = req;

  Document.find({ authorId: userId })
    .sort({ updatedAt: -1 })
    .limit(Number(count))
    .exec((err, documents) => {
      if (err) {
        console.log(err);
      } else {
        res.json(documents);
      }
    });
});

documentRouter.route('/:id').get((req, res) => {
  const {
    user: {
      user: { _id: userId },
    },
    params: { id },
  } = req;

  Document.findById(id, function (err, document) {
    if (!document) {
      res.status(404).send({ status: 404, message: 'Document not found!' });
    } else if (document.authorId === userId) {
      res.json(document);
    } else {
      return res.status(403).send({
        status: 403,
        message: 'Forbidden',
      });
    }
  });
});

documentRouter.route('/:id').put((req, res) => {
  const {
    user: {
      user: { _id: userId },
    },
    params: { id },
  } = req;

  Document.findById(id, (err, document) => {
    if (!document) {
      res.status(404).send({ status: 404, message: 'Document not found!' });
    } else if (document.authorId === userId) {
      const { name, content } = req.body;

      document.name = name ? name : document.name;
      document.updatedAt = new Date().getTime();
      document.content = content;

      document
        .save()
        .then((document) => {
          res.json(document);
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

documentRouter.route('/:id').delete((req, res) => {
  const {
    user: {
      user: { _id: userId },
    },
    params: { id },
  } = req;

  Document.findById(id, (err, document) => {
    if (!document) {
      res.status(404).send({ status: 404, message: 'Document not found!' });
    } else if (document.authorId === userId) {
      document
        .delete()
        .then((document) => {
          access(`./files/${id}`, F_OK, (err) => {
            if (err) {
              res.send({
                status: 204,
                message: 'Already deleted.',
              });
            }

            unlink(`./files/${id}`, (err) => {
              if (err) {
                res.send({
                  status: 400,
                  message: `При удалении документа "${document.name}" произошла ошибка!`,
                });
              }

              res.send({
                status: 200,
                message: `Документ "${document.name}" был успешно удалён`,
                id: document._id,
                subjectId: document.subjectId,
              });
            });
          });

          Subject.findById(document.subjectId, (err, subject) => {
            if (subject.documentCount > 0) {
              subject.documentCount = subject.documentCount - 1;
            }
            subject.save();
          });
        })
        .catch(() => {
          res.send({
            status: 400,
            message: `При удалении документа "${document.name}" произошла ошибка!`,
          });
        });
    } else {
      return res.status(403).send({
        status: 403,
        message: 'Forbidden',
      });
    }
  });
});

documentRouter.route('/').post((req, res) => {
  const {
    user: {
      user: { _id: userId, name: userName },
    },
  } = req;

  const document = new Document(req.body);

  document.createdAt = new Date().getTime();
  document.updatedAt = new Date().getTime();
  document.authorId = userId;
  document.authorName = userName;

  document
    .save()
    .then((document) => {
      Subject.findById(document.subjectId, (err, subject) => {
        subject.documentCount = subject.documentCount + 1;
        subject.save();
      });

      res.json(document);
    })
    .catch((err) => {
      res.status(400).send({
        status: 400,
        message: 'Adding new document failed! Error: ' + err,
      });
    });
});

documentRouter.route('/:id/file').post((req, res) => {
  const {
    user: {
      user: { _id: userId },
    },
    params: { id },
  } = req;

  Document.findById(id, (err, document) => {
    if (err) {
      res.send({
        status: 400,
        message: `При добавлении документа "${document.name}" произошла ошибка!`,
      });
    }

    if (!document) {
      res.status(404).send({ status: 404, message: 'Document is not found!' });
    } else if (document.authorId === userId) {
      req.pipe(createWriteStream(`./files/${id}`));
      req.on('end', () => {
        res.status(200);
      });
    } else {
      return res.status(403).send({
        status: 403,
        message: 'Forbidden',
      });
    }
  });
});

module.exports = documentRouter;
