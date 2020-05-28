const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();

const APP_PORT = 4000;

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));

app.all((req, res, next) => {
  console.log(req.method, req.path);
  res.send({ hey: 'hey' });
  next();
});

const documents = [
  {
    id: '054823bd-aafa-4e6d-ab69-ecd2c646990a',
    title: 'It',
    author: 'Stephen King',
    content: '<p>It is a 1986 horror novel by American author Stephen King. It was his 22nd book, and his 17th novel written under his own name. The story follows the experiences of seven children as they are terrorized by an evil entity that exploits the fears of its victims to disguise itself while hunting its prey. "It" primarily appears in the form of Pennywise the Dancing Clown to attract its preferred prey of young children.</p>'
  }
]

app.post('/documents', (req, res, next) => {
  console.log(req.method, req.path);

  documents.push({ id: uuidv4(), ...req.body })
  console.log(documents);

  return res.sendStatus(200);
});


const customRoutes = require('./routes');

customRoutes.document(app);
customRoutes.user(app);

app.listen(APP_PORT, () => console.log(`Server is running on port ${APP_PORT}`));