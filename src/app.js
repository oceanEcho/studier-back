const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const dotenv = require('dotenv');
const process = require('process');

const connectDatabase = require('./utils/db');
const routes = require('./routes');

const { authenticateToken } = require('./utils/auth');

const app = express();

dotenv.config();

connectDatabase();

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));

app.all('*', (req, res, next) => {
  console.log(req.method, req.path, new Date());
  next();
});

app.use('/', routes.auth);
app.use('/', routes.register);
app.use('/user', authenticateToken, routes.user);
app.use('/document', authenticateToken, routes.document);
app.use('/subject', authenticateToken, routes.subject);
app.use('/note', authenticateToken, routes.note);

const APP_PORT = process.env.PORT || 4000;

app.listen(APP_PORT, () => {
  console.log(`Server is running on  port ${APP_PORT}.`);
});
