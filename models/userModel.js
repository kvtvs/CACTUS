'use strict';
const pool = require('../database/db');
const { httpError } = require('../utils/errors');
const promisePool = pool.promise();

const getAllUsers = async (next) => {
  try {
    const [rows] = await promisePool.query(
      'SELECT user_id, username, email, role FROM user'
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
      'SELECT user_id, username, email, role FROM user WHERE user_id = ?',
      [id]
      );
    return rows;
  } catch (e) {
    console.error('getUser error', e.message);
    next(httpError('Database error', 500));
  }
};

const addUser = async (email, username, password, next) => {
  try {
    const [rows] = await promisePool.execute(
      'INSERT INTO wop_user (email, username, password) VALUES (?, ?, ?)',
      [email, username, password]
      );
    return rows;
  } catch (e) {
    console.error('addUser error', e.message);
    next(httpError('Database error', 500));
  }
};

const getUserLogin = async (params) => {
  try {
    console.log(params);
    const [rows] = await promisePool.execute(
        'SELECT * FROM user WHERE email = ?;',
        params);
    return rows;
  } catch (e) {
    console.log('error', e.message);
    next(httpError('Database error', 500));
  }
};

module.exports = {
  getAllUsers,
  getUser,
  addUser,
  getUserLogin,
};