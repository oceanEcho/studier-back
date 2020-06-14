const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Subject = new Schema({
  name: {
    type: String,
  },
  authorId: {
    type: String,
  },
  createdAt: {
    type: Number,
  },
  documentCount: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model('Subject', Subject, 'subjects');
