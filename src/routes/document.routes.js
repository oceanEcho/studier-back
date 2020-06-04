const documentRouter = require('express').Router();
const Document = require('../models/document.model');

documentRouter.route('/list').get((req, res) => {
  const { user: {user: { _id: userId}} } = req;

  Document.find({ authorId: userId}, (err, documents) => {
    if (err) {
      console.log(err);
    } else {
      res.json(documents);
    }
  });
});

documentRouter.route('/:id').get((req, res) => {
  const id = req.params.id;
  Document.findById(id, function (err, document) {
    res.json(document);
  });
});

documentRouter.route('/:id').put((req, res) => {
  Document.findById(req.params.id, (err, document) => {
    if (!document) {
      res.status(404).send('Document is not found!');
    } else {
      const { name, discipline, content } = req.body;

      document.name = name;
      document.updatedAt = new Date().getTime();
      document.content = content;
      document.discipline = discipline;

      document.save()
        .then(document => {
          res.json('Document has been updated!');
        })
        .catch(err => {
          res.status(400).send('Update is not possible!');
        });
    }
  });
});

documentRouter.route('/:id').delete((req, res) => {
  Document.findById(req.params.id, (err, document) => {
    if (!document) {
      res.status(404).send('Document is not found!');
    } else {
      document.delete()
        .then(document => {
          res.json('Document has been deleted!');
        })
        .catch(err => {
          res.status(400).send('Delete is not possible!');
        });
    }
  });
});

documentRouter.route('/').post((req, res) => {
  const document = new Document(req.body);
  document.createdAt = new Date().getTime();
  document.save()
    .then(document => {
      res.status(200).json('Document added successfully!');
    })
    .catch(err => {
      res.status(400).send('Adding new document failed!');
    });
});

module.exports = documentRouter;
