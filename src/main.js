const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const app = express();

const APP_PORT = 4000;

app.use(cors());
app.use(bodyParser.json());

app.all('/', (req, res, next) => {
  console.log(req.method, req.path);
  res.send({ hey: 'hey' });
  next();
});

app.post('/document', (req, res, next) => {
  console.log(req.method, req.path, req.body);
  return res.sendStatus(200);
});

app.listen(APP_PORT, () => console.log(`Server listening at http://localhost:${APP_PORT}`));