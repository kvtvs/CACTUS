'use strict';
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const plantRoute = require('./routes/plantRoute');
const userRoute = require('./routes/userRoute');
const authRoute = require('./routes/authRoute');
const passport = require('./utils/pass');
const { httpError } = require('./utils/errors');
const { Passport } = require('passport');



const app = express();

app.use(cors());

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
if (process.env.NODE_ENV === 'production') {
  require('./utils/production')(app, process.env.PORT, process.env.HTTPS_PORT);
} else {
  require('./utils/localhost')(app, process.env.PORT);
}


app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(express.static('./uploads/'));

app.use(passport.initialize());

app.use('/auth', authRoute);
app.use('/plant', passport.authenticate('jwt', {session: false}), plantRoute);
app.use('/user', passport.authenticate('jwt', {session: false}), userRoute);

app.use('/plant', plantRoute);
app.use('/user', userRoute);

app.use((req, res, next) => {
    const err = httpError('Not Found', 404);
    next(err);
})

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
            message: err.message || 'internal server error'
    });
});



app.use(express.static('public'));