'use strict';
const pool = require('../database/db.js');
const { httpError } = require('../utils/errors');
const promisePool = pool.promise();

const getAllUsers = async (next) => {
  try {
    const [rows] = await promisePool.query(
      'SELECT KäyttäjäID, Käyttäjänimi, Sähköposti, Rooli FROM Käyttäjä'
      );
    return rows;
  } catch (e) {
    console.error('error', e.message);
    next(httpError('Database error', 500));
  }
};


const getUser = async (id, next) => {
  try {
    const [rows] = await promisePool.execute(
      'SELECT KäyttäjäID, Käyttäjänimi, Sähköposti, Rooli FROM Käyttäjä WHERE KäyttäjäID = ?',
      [id]
      );
    return rows;
  } catch (e) {
    console.error('getUser error', e.message);
    next(httpError('Database error', 500));
  }
};

const addUser = async (username, email, passwd, next) => {
  try {
    const [rows] = await promisePool.execute(
      'INSERT INTO Käyttäjä (Käyttäjänimi, Sähköposti, Salasana) VALUES (?, ?, ?)',
      [username, email, passwd]
      );
    return rows;
  } catch (e) {
    console.error('addUser error', e.message);
    next(httpError('Database error', 500));
  }
};

const getUserLogin = async (params) => {
  try {
    console.log(params)
    const [rows] = await promisePool.execute(
        'SELECT * FROM Käyttäjä WHERE Sähköposti = ?;',
        params);
    return rows;
  } catch (e) {
    console.log(e)
    throw(httpError('Database error', 500));
  }
};

module.exports = {
  getAllUsers,
  getUser,
  addUser,
  getUserLogin,
};