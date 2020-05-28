const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

const APP_PORT = 4000;

const routes = require('./routes');

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));

mongoose.connect('mongodb://127.0.0.1:27017/studier', {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

const connection = mongoose.connection;

connection.once('open', function () {
  console.log('MongoDB database connection established successfully.');
})

app.use('/user', routes.user);
app.use('/document', routes.document);

app.listen(APP_PORT, () => {
  console.log(`Server is running on port ${APP_PORT}.`);
});