// userController
'use strict';

const { validationResult } = require('express-validator');
const { getAllUsers, getUser, addUser } = require('../models/userModel');
const { httpError } = require('../utils/errors');


const user_list_get = async (req, res, next) => {
  try {
    const users = await getAllUsers(next);
    if(users.length > 0){
      res.json(users);
    }
    else {
      next('Käyttäjiä ei löydy', 404);
    }
  }
  catch (e) {
    next(httpError('internal server error', 500));
  }
};

const user_get = async (req, res, next) => {
  try {
    const vastaus = await getUser(req.params.id, next);
    if(vastaus.length > 0){
      res.json(vastaus.pop());
    }
    else {
      next(httpError('Käyttäjiä ei löydy', 404));
    }
  }
  catch (e) {
    next(httpError('internal server error', 500));
  }
};



const checkToken = (req, res, next) => {
  if (!req.user) {
    next(new Error('token not valid'));
  } else {
    res.json({ user: req.user });
  }
 };

module.exports = {
  user_list_get,
  user_get,
  checkToken,
};