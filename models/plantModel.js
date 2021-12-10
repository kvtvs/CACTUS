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
      KäyttäjäID,
      Käyttäjä.Käyttäjänimi as seller
      FROM Tuote
      JOIN Käyttäjä ON
      Tuote.KäyttäjäID = Käyttäjä.KäyttäjäID`
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
      KäyttäjäID,
      Käyttäjä.Käyttäjänimi as myyjä
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

const addPlant = async (Nimi, Kuvaus, Hinta, Filename, Julkaisu_pvm, KäyttäjäID, next) => {
  try {
    const [rows] = await promisePool.execute(
      'INSERT INTO Tuote (TuoteID, Nimi, Kuvaus, Hinta, Filename, Julkaisu_pvm, KäyttäjäID) VALUES (?, ?, ?, ?, ?, ?, ?)', 
      [Nimi, Kuvaus, Hinta, Filename, Julkaisu_pvm, KäyttäjäID]
      );
    return rows;
  } catch (e) {
    console.error('addPlant error', e.message);
    next(httpError('Database error', 500));
  }
};

const modifyPlant = async (
  Nimi,
  Kuvaus,
  Hinta,
  TuoteID,
  Rooli,
  next
) => {
  let sql =
    'UPDATE Tuote SET Nimi = ?, Kuvaus = ?, Hinta = ? WHERE TuoteID = ? AND KäyttäjäID = ?;';
  let params = [Nimi, Kuvaus, Hinta, TuoteID, KäyttäjäID];
  if (Rooli === 0) {
    sql =
      'UPDATE Tuote SET Nimi = ?, Kuvaus = ?, Hinta = ?, KäyttäjäID = ? WHERE TuoteID = ?;';
    params = [Nimi, Kuvaus, Hinta, TuoteID,];
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


const deletePlant = async (TuoteID, KäyttäjäID, Rooli, next) => {
  let sql = 'DELETE FROM Tuote WHERE TuoteID = ? AND KäyttäjäID = ?';
  let params = [TuoteID, KäyttäjäID];
  if (Rooli === 0){
    sql = 'DELETE FROM Tuote WHERE TuoteID = ?';
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