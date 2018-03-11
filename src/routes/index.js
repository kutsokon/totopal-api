const express = require('express');

const router = express.Router();

const countries = require('../countries/countries.route');
const leagues = require('../leagues/leagues.route');

router.use('/countries', countries);
router.use('/leagues', leagues);

router.get('/', (req, res) => {
  res.send('Hello world');
});

module.exports = router;
