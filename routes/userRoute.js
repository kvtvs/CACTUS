'use strict';
// userRoute
const express = require('express');
const { body } = require('express-validator');
const { user_list_get, user_get, checkToken } = require('../controllers/userController');
const router = express.Router();

router.get('/token', checkToken);
router.get('/', user_list_get); 
router.get('/:id', user_get);


router.put('/', (req, res) => {
  res.send('With this endpoint you can edit users.')
});

router.delete('/', (req, res) => {
  res.send('With this endpoint you can delete users.')
});

module.exports = router;