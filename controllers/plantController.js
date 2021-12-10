'use strict';
// plantController

const { validationResult } = require('express-validator');
const { getAllPlants, getPlant, addPlant, modifyPlant, deletePlant } = require('../models/plantModel');
const { httpError } = require('../utils/errors');

const plant_list_get = async (req, res, next) => {
    try {
      const plant = await getAllPlants(next);
      if(plants.length > 0){
        res.json(plants);
      }
      else {
        next('No plants found', 404);
      }
    }
    catch (e) {
      console.log('plant_list_get error', e.message);
      next(httpError('internal server error', 500));
    }
  };
  
  const plant_get = async (req, res, next) => {
    try {
      const vastaus = await getPlant(req.params.id, next);
      if(vastaus.length > 0){
        res.json(vastaus.pop());
      }
      else {
        next(httpError('No plants found', 404));
      }
    }
    catch (e) {
      console.log('plant_get error', e.message);
      next(httpError('internal server error', 500));
    }
  };
  
  const plant_post = async (req, res, next) => {
    // päivämäärä VVVV-KK-PP esim 2015-05-15
    console.log('plant_post', req.body, req.file, req.user);
    const errors = validationResult(req);
    if (!errors.isEmpty()){
      console.log('plant_post validation', errors.array());
      next(httpError('invalid data', 400));
      return;
    }
    if (!req.file){
      const err = httpError('file not valid', 400);
      next(err);
      return;
      }
  
    try {
        const { Nimi, Kuvaus, Hinta, Filename, Julkaisu_pvm } = req.body;
        const tulos = await addPlant(
          Nimi,
          Kuvaus,
          Hinta,
          Filename,
          Julkaisu_pvm,
          req.user.KäyttäjäID,
          next
        );
        if(tulos.affectedRows > 0){
          res.json({
              message: "plant added",
              plant_id: tulos.insertId,
          });
        } else {
          next(httpError('No plant inserted', 400));
        }
    } catch (error) {
      console.log('plant_post error', error.message);
      next(httpError('internal server error', 500));
    }
  };
  
  const plant_put = async (req, res, next) => {
    console.log('plant_put', req.body, req.params);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('plant_put validation', errors.array());
      next(httpError('invalid data', 400));
      return;
    }
    try {
      const { Nimi, Kuvaus, Hinta } = req.body;
 
      // TODO: HUOM! KäyttäjäID?
      const owner = req.user.Rooli === 0 ? req.body.owner : req.user.KäyttäjäID;
  
      const tulos = await modifyPlant(
        Nimi,
        Kuvaus,
        Hinta,
        req.params.id,
        req.user.Rooli,
        next
      );
      if (tulos.affectedRows > 0) {
        res.json({
          message: 'Ilmoitusta muokattu!',
          plant_id: tulos.insertId,
        });
      } else {
        next(httpError('Ilmoituksen muokkaus epäonnistui', 400));
      }
    } catch (e) {
      console.log('plant_put error', e.message);
      next(httpError('internal server error', 500));
    }
  };
  
  const plant_delete = async (req, res, next) => {
    try {
      const vastaus = await deletePlant(req.params.TuoteID, req.user.KäyttäjäID, req.user.Rooli, next);
      if(vastaus.affectedRows > 0){
        res.json({
        message: 'Ilmoitus poistettu',
        plant_id: vastaus.insertId
      });
      }
      else {
        next(httpError('Ilmoitusta ei löydy', 404));
      }
    }
    catch (e) {
      console.log('plant_delete error', e.message);
      next(httpError('internal server error', 500));
    }
  };
  
  module.exports = {
    plant_list_get,
    plant_get,
    plant_post,
    plant_put,
    plant_delete,
  };