const noteRouter = require('express').Router();
const Note = require('../models/note.model');

noteRouter.route('/list').get((req, res) => {
  const {
    user: {
      user: { _id: userId },
    },
    query: { count },
  } = req;

  Note.find({ authorId: userId })
    .sort({ updatedAt: -1 })
    .limit(Number(count))
    .exec((err, notes) => {
      if (err) {
        console.log(err);
      } else {
        res.json(notes);
      }
    });
});

noteRouter.route('/:id').get((req, res) => {
  const {
    user: {
      user: { _id: userId },
    },
    params: { id },
  } = req;

  Note.findById(id, function (err, note) {
    if (!note) {
      res.status(404).send({ status: 403, message: 'Note is not found!' });
    } else if (note.authorId === userId) {
      res.json(note);
    } else {
      return res.status(403).send({
        status: 403,
        message: 'Forbidden',
      });
    }
  });
});

noteRouter.route('/:id').put((req, res) => {
  const {
    user: {
      user: { _id: userId },
    },
    params: { id },
  } = req;

  Note.findById(id, (err, note) => {
    if (!note) {
      res.status(404).send({ status: 403, message: 'Note is not found!' });
    } else if (note.authorId === userId) {
      const { name, content } = req.body;

      note.name = name ? name : note.name;
      note.updatedAt = new Date().getTime();
      note.content = content;

      note
        .save()
        .then((note) => {
          res.json(note);
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

noteRouter.route('/:id').delete((req, res) => {
  const {
    user: {
      user: { _id: userId },
    },
    params: { id },
  } = req;

  Note.findById(id, (err, note) => {
    if (!note) {
      res.status(404).send({ status: 403, message: 'Note is not found!' });
    } else if (note.authorId === userId) {
      note
        .delete()
        .then((note) => {
          res.send({
            status: 200,
            message: `Заметка "${note.name}" успешно удалёна`,
            id: note._id,
          });
        })
        .catch(() => {
          res.send({
            status: 400,
            message: `При удалении заметки "${note.name}" произошла ошибка!`,
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

noteRouter.route('/').post((req, res) => {
  const {
    user: {
      user: { _id: userId, name: userName },
    },
  } = req;

  const note = new Note(req.body);

  note.createdAt = new Date().getTime();
  note.updatedAt = new Date().getTime();
  note.authorId = userId;
  note.authorName = userName;

  note
    .save()
    .then((note) => {
      res.json(note);
    })
    .catch((err) => {
      res.status(400).send({
        status: 400,
        message: 'Adding new note failed! Error: ' + err,
      });
    });
});

module.exports = noteRouter;
