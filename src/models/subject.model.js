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
});

module.exports = mongoose.model('Subject', Subject, 'subjects');
