'use strict';


const pool = require('../database/db');
const { httpError } = require('../utils/errors');
const promisePool = pool.promise();

const getAllPlants = async (next) => {
  try {
    // TODO: KORJAA JA VAIHDA
    const [rows] = await promisePool.query(
      `SELECT
      cat_id,
      wop_cat.name,
      weight,
      owner,
      filename,
      birthdate,
      coords,
      wop_user.name as ownername
      FROM wop_cat
      JOIN wop_user ON
      wop_cat.owner = wop_user.user_id`
      );
    return rows;
  } catch (e) {
    console.error('error', e.message);
    next(httpError('Database error', 500));
  }
};


const getPlant = async (id, next) => {
  try {
    // TODO: KORJAA JA VAIHDA
    const [rows] = await promisePool.execute(
      `SELECT
      cat_id,
      wop_cat.name,
      weight,
      owner,
      filename,
      birthdate,
      coords,
      wop_user.name as ownername
      FROM wop_cat
      JOIN wop_user ON
      wop_cat.owner = wop_user.user_id
      WHERE cat_id = ?`, 
      [id]
      );
    return rows;
  } catch (e) {
    console.error('getPlant error', e.message);
    next(httpError('Database error', 500));
  }
};

// TODO: KORJAA JA VAIHDA
const addPlant = async (name, weight, owner, filename, coords, birthdate, next) => {
  try {
    const [rows] = await promisePool.execute(
      'INSERT INTO wop_cat (name, weight, owner, filename, coords, birthdate) VALUES (?, ?, ?, ?, ?, ?)', 
      [name, weight, owner, filename, birthdate, coords]
      );
    return rows;
  } catch (e) {
    console.error('addPlant error', e.message);
    next(httpError('Database error', 500));
  }
};

// TODO: KORJAA JA VAIHDA
const modifyPlant = async (
  name,
  weight,
  owner,
  birthdate,
  cat_id,
  role,
  next
) => {
  let sql =
    'UPDATE wop_cat SET name = ?, weight = ?, birthdate = ? WHERE cat_id = ? AND owner = ?;';
  let params = [name, weight, birthdate, cat_id, owner];
  if (role === 0) {
    sql =
      'UPDATE wop_cat SET name = ?, weight = ?, birthdate = ?, owner = ? WHERE cat_id = ?;';
    params = [name, weight, birthdate, owner, cat_id];
  }
  console.log('sql', sql);
  try {
    const [rows] = await promisePool.execute(sql, params);
    return rows;
  } catch (e) {
    console.error('addPlant error', e.message);
    next(httpError('Database error', 500));
  }
};

// TODO: KORJAA JA VAIHDA
const deletePlant = async (id, owner_id, role, next) => {
  let sql = 'DELETE FROM wop_cat WHERE cat_id = ? AND owner = ?';
  let params = [id, owner_id];
  if (role === 0){
    sql = 'DELETE FROM wop_cat WHERE cat_id = ?';
    params = [id];
  }
  try {
    const [rows] = await promisePool.execute(
       sql,
      params
      );
    return rows;
  } catch (e) {
    console.error('addPlant error', e.message);
    next(httpError('Database error', 500));
  }
};

module.exports = {
  getAllPlants,
  getPlant,
  addPlant,
  modifyPlant,
  deletePlant,
};