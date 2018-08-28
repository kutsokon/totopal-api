import Joi from 'joi';

import Country from './countries.model';
import logger from '../utils/logger';

// get -> /countries
export function getCountries(req, res) {
  Country.find()
    .then((countries) => {
      logger.info('All countries have been gotten');
      res.send(countries);
    })
    .catch((error) => {
      logger.error(error.message);
      res.status(404).send(error.message);
    });
}

// get -> /countries/:id
export function getCountry(req, res) {
  const { id } = req.params;

  Country.findOne({ _id: id })
    .then((country) => {
      logger.info('A country has been gotten', country);
      res.send(country);
    })
    .catch((error) => {
      logger.error(error.messag);
      res.status(404).send(error.messag);
    });
}

// post -> /countries
export function addCountry(req, res) {
  const result = validateCountry(req.body);

  if (result.error) {
    logger.error(result.error.details[0].message);
    res.status(404).send(result.error.details[0].message);
    return;
  }

  const { name, leagues } = result.value;

  Country.findOneAndUpdate({ name }, { name, leagues }, { upsert: true, new: true })
    .then((country) => {
      logger.info('Country has been created');
      res.send(country);
    })
    .catch((error) => {
      logger.error(error.message);
      res.status(404).send(error.message);
    });
}

// put -> /countries/:id
export function updateCountry(req, res) {
  const { id } = req.params;
  const result = validateCountry(req.body);

  if (result.error) {
    logger.error(result.error.details[0].message);
    res.status(404).send(result.error.details[0].message);
    return;
  }

  const { name, leagues} = result.value;

  Country.findOneAndUpdate(
    { _id: id },
    { name: name, leagues: leagues },
    { upsert: true, new: true }
  )
    .then((country) => {
      logger.info('Country has been updated');
      res.send(country);
    })
    .catch((error) => {
      logger.error(error.message);
      res.status(404).send(error.message);
    });
}

// delete -> /countries/:id
export function removeCountry(req, res) {
  const { id } = req.params;

  Country.findOneAndRemove({ _id: id })
    .then(() => {
      logger.info('Country has been removed');
      res.send('Country has been removed');
    })
    .catch((error) => {
      logger.error(error.message);
      res.status(404).send(error.message);
    });
}

// validate request body
export function validateCountry(country) {
  const countrySchema = {
    name: Joi.string().min(3).required(),
    leagues: Joi.array().items(Joi.number())
  };

  return Joi.validate(country, countrySchema);
}
