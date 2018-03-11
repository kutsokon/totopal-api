const express = require('express');

const countries = express.Router();

countries.get('/', (req, res) => {
  res.send('Hello world countries');
});

module.exports = countries;
