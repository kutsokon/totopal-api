import express from 'express';
import {
  addCountry,
  getCountries,
  getCountry,
  removeCountry,
  updateCountry
} from './countries.controller';

const countries = express.Router();

countries.get('/countries', getCountries);
countries.get('/countries/:id', getCountry);
countries.post('/countries', addCountry);
countries.put('/countries/:id', updateCountry);
countries.delete('/countries/:id', removeCountry);

export default countries;
