'use strict';
const { Router } = require('express');
// PlantRoute
const express = require('express');
const { body } = require('express-validator');
const multer = require('multer');
const fileFilter = (req, file, cb) => {
    if(file.mimetype.includes('image')){
        cb(null,true);
    } else {
        cb(null, false);
    }
}
const upload = multer({ dest: './uploads/', fileFilter });
const { plant_list_get, plant_get, plant_post, plant_put, plant_delete } = require('../controllers/plantController');

const router = express.Router();

router
    .route('/')
    .get(plant_list_get)
    .post(upload.single('photo1'),
    body('name').notEmpty().escape(),
    body('description').notEmpty(),
    body('price').isNumeric(),
    plant_post)

    

router
    .route('/:id')
    .get(plant_get)
    .delete(plant_delete)
    .put( 
        body('name').notEmpty().escape(),
        body('description').notEmpty(),
        body('price').isNumeric(),
        plant_put
    );

module.exports = router;