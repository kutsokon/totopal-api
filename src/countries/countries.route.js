const express = require('express');
const {
  getCountries,
  getCountry,
  addCountry,
  updateCountry,
  removeCountry
} = require('./countries.controller');

const countries = express.Router();

countries.get('/', getCountries);
countries.get('/:id', getCountry);
countries.post('/', addCountry);
countries.put('/:id', updateCountry);
countries.delete('/:id', removeCountry);

module.exports = countries;
