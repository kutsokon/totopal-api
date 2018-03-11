const express = require('express');

const leagues = express.Router();

leagues.get('/', (req, res) => {
  res.send('Hello world leagues');
});

module.exports = leagues;
