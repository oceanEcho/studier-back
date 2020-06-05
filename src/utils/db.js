const mongoose = require('mongoose');
const process = require('process');

const connectDatabase = () => {
  mongoose.connect(process.env.DATABASE_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  });

  const connection = mongoose.connection;

  connection.once('open', function () {
    console.log('MongoDB database connection established successfully.');
  });
};

module.exports = connectDatabase;