const multer = require('multer');
const upload = multer({ dest: 'tmp/' });

const { document } = require('../controllers');

module.exports = function(server) {
  server.get('/api/document', document.getDocumentList);
  server.post('/api/document', document.postDocument);
  server.put('/api/document/:id', document.putDocument);
  server.get('/api/document/:id', document.getDocument);
  server.delete('/api/document/:id', document.deleteDocument);
  server.post('/api/document/:id/sample', upload.single('file'), document.postDocumentSample);
};
