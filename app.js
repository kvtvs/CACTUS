'use strict';
const express = require('express');
const app = express();
const port = 3000;

app.get('/plant', (req, res) => {
  res.send('From this endpoint you can get plants.')
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
