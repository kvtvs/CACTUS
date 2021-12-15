'use strict';
// plantController

const { validationResult } = require('express-validator');
const { getAllPlants, getPlant, addPlant, modifyPlant, deletePlant } = require('../models/plantModel');
const { httpError } = require('../utils/errors');

const plant_list_get = async (req, res, next) => {
    try {
      const plants = await getAllPlants(next);
      if(plants.length > 0){
        res.json(plants);
      }
      else {
        next('Tuotteita ei löydy', 404);
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
        next(httpError('Tuotteita ei löydy', 404));
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
      next(httpError('Epäsopivat tiedot, kokeile uudestaan', 400));
      return;
    }
    if (!req.file){
      const err = httpError('Tiedostomuoto ei käy, kokeile jotain muuta', 400);
      next(err);
      return;
      }
  
    try {
        const { name, description, price } = req.body;
        const tulos = await addPlant(
          name,
          description,
          price,
          req.file.filename,
          req.user.KäyttäjäID,
          next
        );
        if(tulos.affectedRows > 0){
          res.json({
              message: "Tuote lisätty",
              plant_id: tulos.insertId,
          });
        } else {
          next(httpError('Tuotetta ei lisätty', 400));
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
      const { name, price, description } = req.body;
 
  
      const tulos = await modifyPlant(
        name,
        price,
        description,
        req.params.id,
        req.user.KäyttäjäID,
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
    console.log('plant_delete', req.body, req.params);
    try {
      const vastaus = await deletePlant(req.params.id, req.user.KäyttäjäID, next);
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