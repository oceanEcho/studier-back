const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Note = new Schema({
  name: {
    type: String,
  },
  authorName: {
    type: String,
  },
  authorId: {
    type: String,
  },
  createdAt: {
    type: Number,
  },
  updatedAt: {
    type: Number,
  },
  content: {
    type: String,
  },
});

module.exports = mongoose.model('Note', Note, 'notes');
