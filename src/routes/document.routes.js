const documentRouter = require('express').Router();
const Document = require('../models/document.model');

documentRouter.route('/list').get((req, res) => {
  const {
    user: {
      user: { _id: userId },
    },
    query: { count },
  } = req;

  Document.find({ authorId: userId })
    .sort({ createdAt: -1 })
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
      res.status(404).send({ status: 403, message: 'Document is not found!' });
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
      res.status(404).send({ status: 403, message: 'Document is not found!' });
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
      res.status(404).send({ status: 403, message: 'Document is not found!' });
    } else if (document.authorId === userId) {
      document
        .delete()
        .then((document) => {
          res.json(`Document ${document._id} has been deleted!`);
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

documentRouter.route('/').post((req, res) => {
  const {
    user: {
      user: { _id: userId, name: userName },
    },
  } = req;

  const document = new Document(req.body);

  document.createdAt = new Date().getTime();
  document.updatedAt = document.createdAt;
  document.authorId = userId;
  document.authorName = userName;

  document
    .save()
    .then((document) => {
      res.json(document);
    })
    .catch((err) => {
      res.status(400).send({
        status: 400,
        message: 'Adding new document failed! Error: ' + err,
      });
    });
});

module.exports = documentRouter;
