const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Document = new Schema({
  name: {
    type: String,
  },
  subjectName: {
    type: String,
  },
  subjectId: {
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

module.exports = mongoose.model('Document', Document, 'documents');
