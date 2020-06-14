const document = require('./document.routes');
const user = require('./user.routes');
const auth = require('./auth.routes');
const subject = require('./subject.routes');
const note = require('./note.routes');
const register = require('./register.routes');

module.exports = {
  document,
  user,
  auth,
  subject,
  note,
  register,
};
