// const uuidv4 = require('uuid/v4');

// const db = require('../../db');
// const { getItemIndex } = require('../../utils');

// const userDb = db().users;

// Get current user
const getCurrentUser = (req, res) => {
  const user = userDb.content[0];

  if (user) {
    return res.send(user);
  }

  res.sendStatus(404);
};

// Get user by id
const getUser = (req, res) => {
  const { id } = req.params;
  const user = userDb.content.find(object => object.id === id);

  if (user) {
    return res.send(user);
  }

  res.sendStatus(404);
};

// Add new user
const postUser = (req, res) => {
  const item = {
    id: uuidv4(),
    ...req.body,
    createdAt: Date.now(),
  };

  if (req.body) {
    userDb.content.push(item);
    userDb.total++;

    res.status(201);
    return res.send(item);
  }

  res.sendStatus(452);
};

// Update user by id
const putUser = (req, res) => {
  const { id } = req.params;
  const userIndex = getItemIndex(userDb, id);

  if (userIndex !== -1) {
    const item = userDb.content[userIndex];

    userDb.content[userIndex] = {
      ...item,
      ...req.body,
    };

    res.status(202);
    return res.send(userDb.content[userIndex]);
  }

  res.sendStatus(404);
};

// Delete user by id
const deleteUser = (req, res) => {
  const { id } = req.params;
  const userIndex = getItemIndex(userDb, id);

  if (userIndex !== -1) {
    userDb.content.splice(userIndex, 1);

    return res.send(userDb.content);
  }

  res.sendStatus(404);
};

module.exports = {
  getUserList,
  postUserEulaAccept,
  getUser,
  postUser,
  putUser,
  deleteUser,
  getCurrentUser,
};
