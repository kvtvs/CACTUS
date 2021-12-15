'use strict';

const pool = require('../database/db.js');
const { httpError } = require('../utils/errors');
const promisePool = pool.promise();


const getAllPlants = async (next) => {
  try {
    const [rows] = await promisePool.query(
      `SELECT
      TuoteID,
      Tuote.Nimi,
      Kuvaus,
      Hinta,
      Filename,
      Julkaisu_pvm,
      Tuote.KäyttäjäID
      FROM Tuote
      JOIN Käyttäjä ON
      Tuote.KäyttäjäID = Käyttäjä.KäyttäjäID
      ORDER BY TuoteID DESC`
      );
    return rows;
  } catch (e) {
    console.error('error', e.message);
    next(httpError('Database error', 500));
  }
};


const getPlant = async (id, next) => {
  try {
    const [rows] = await promisePool.execute(
      `SELECT
      TuoteID,
      Tuote.Nimi,
      Kuvaus,
      Hinta,
      Filename,
      Julkaisu_pvm,
      Tuote.KäyttäjäID
      FROM Tuote
      JOIN Käyttäjä ON
      Tuote.KäyttäjäID = Käyttäjä.KäyttäjäID
      WHERE TuoteID = ?`, 
      [id]
      );
    return rows;
  } catch (e) {
    console.error('getPlant error', e.message);
    next(httpError('Database error', 500));
  }
};

const addPlant = async (Nimi, Kuvaus, Hinta, Filename, KäyttäjäID, next) => {
  try {
    const [rows] = await promisePool.execute(
      'INSERT INTO Tuote ( Nimi, Kuvaus, Hinta, Filename, KäyttäjäID) VALUES (?, ?, ?, ?, ?)', 
      [Nimi, Kuvaus, Hinta, Filename, KäyttäjäID]
      );
    return rows;
  } catch (e) {
    console.error('addPlant error', e.message);
    next(httpError('Database error', 500));
  }
};

const modifyPlant = async (
  Nimi,
  Hinta,
  Kuvaus,
  TuoteID,
  KäyttäjäID,
  next
) => {
  let sql =
    'UPDATE Tuote SET Nimi = ?, Kuvaus = ?, Hinta = ? WHERE TuoteID = ? AND KäyttäjäID = ?;';
  let params = [Nimi, Kuvaus, Hinta, TuoteID, KäyttäjäID];
  console.log('sql', sql);
  try {
    const [rows] = await promisePool.execute(sql, params);
    return rows;
  } catch (e) {
    console.error('addPlant error', e.message);
    next(httpError('Database error', 500));
  }
};


const deletePlant = async (TuoteID, KäyttäjäID, next) => {
  let sql = 'DELETE FROM Tuote WHERE TuoteID = ? AND KäyttäjäID = ?';
  let params = [TuoteID, KäyttäjäID];
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