const { user } = require('../controllers');

module.exports = function(server) {
  server.get('/api/user', user.getUserList);
  server.get('/api/user/current', user.getCurrentUser);
  server.get('/api/user/:id', user.getUser);
  server.post('/api/user', user.postUser);
  server.put('/api/user/:id', user.putUser);
  server.delete('/api/user/:id', user.deleteUser);
};
