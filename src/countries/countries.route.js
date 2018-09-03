import express from 'express';
import {
  addCountry,
  getCountries,
  getCountry,
  removeCountry,
  updateCountry
} from './countries.controller';
import checkAuth from '../middleware/auth';

const countries = express.Router();

countries.get('/countries', getCountries);
countries.get('/countries/:id', getCountry);
countries.post('/countries', checkAuth, addCountry);
countries.put('/countries/:id', checkAuth, updateCountry);
countries.delete('/countries/:id', checkAuth, removeCountry);

export default countries;
