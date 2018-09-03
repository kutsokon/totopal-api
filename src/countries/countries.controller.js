import Joi from 'joi';

import Country from './countries.model';
import logger from '../utils/logger';

// GET -> /countries
export function getCountries(req, res) {
  Country.find()
    .then(countries => {
      logger.info('All countries have been got');
      res.json({ data: { countries } });
    })
    .catch(error => {
      logger.error(error.message);
      res.status(404).json({ message: error.message });
    });
}

// GET -> /countries/:id
export function getCountry(req, res) {
  const { id } = req.params;

  Country.findOne({ _id: id })
    .then(country => {
      logger.info('A country has been got');
      res.json({ data: { country } });
    })
    .catch(error => {
      logger.error(error.messag);
      res.status(404).json({ message: error.message });
    });
}

// POST -> /countries
export function addCountry(req, res) {
  const result = validateCountry(req.body);

  if (result.error) {
    logger.error(result.error.details[0].message);
    res.status(404).json({ message: result.error.details[0].message });
    return;
  }

  const { name, leagues } = result.value;

  new Country({
    name,
    leagues
  })
    .save()
    .then(() => {
      logger.info('A country has been created');
      res.json({ message: 'A country has been created' });
    })
    .catch(error => {
      logger.error(error.message);
      res.status(404).json({ message: error.message });
    });
}

// PUT -> /countries/:id
export function updateCountry(req, res) {
  const { id } = req.params;
  const result = validateCountry(req.body);

  if (result.error) {
    logger.error(result.error.details[0].message);
    res.status(404).json({ message: result.error.details[0].message });
    return;
  }

  const { name, leagues } = result.value;

  Country.findOneAndUpdate({ _id: id }, { name: name, leagues: leagues })
    .then(() => {
      logger.info('A country has been updated');
      res.json({ message: 'A country has been updated' });
    })
    .catch(error => {
      logger.error(error.message);
      res.status(404).json({ message: error.message });
    });
}

// DELETE -> /countries/:id
export function removeCountry(req, res) {
  const { id } = req.params;

  Country.findOneAndRemove({ _id: id })
    .then(() => {
      logger.info('A country has been removed');
      res.json({ message: 'A country has been removed' });
    })
    .catch(error => {
      logger.error(error.message);
      res.status(404).json({ message: error.message });
    });
}

function validateCountry(country) {
  const countrySchema = {
    name: Joi.string()
      .min(3)
      .required(),
    leagues: Joi.array().items(Joi.number())
  };

  return Joi.validate(country, countrySchema);
}
