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
export function addCountry(req, res) {
  const result = validateCountry(req.body);

  if (result.error) {
    logger.error(result.error.details[0].message);
    res.status(404).send(result.error.details[0].message);
    return;
  }

  const { name, leages } = result.value;
  const newCountry = Country({
    name,
    leages
  });

  newCountry.save((error, country) => {
    if (error) {
      logger.error(error.message);
      res.status(404).send(error.message);
    } else {
      logger.info('New country was added');
      res.send(country);
    }
  });
}

// post -> /countries
export function getCountry(req, res) {
  const { id } = req.params;

  if (id) {
    Country.findOne({ id })
      .then((country) => {
        logger.info('A country has been gotten');
        res.send(country);
      })
      .catch((error) => {
        logger.error(error.messag);
        res.status(404).send(error.messag);
      });
  } else {
    logger.error('Can`t get a country with such params');
    res.status(404).send('Can`t get a country with such params');
  }
}

// put -> /countries/:id
export function updateCountry(req, res) {
  const result = validateCountry(req.body);

  if (result.error) {
    logger.error(result.error.details[0].message);
    res.status(404).send(result.error.details[0].message);
    return;
  }

  const countryData = result.value;

  Country.findOneAndUpdate(
    { id: countryData.id },
    { name: countryData.name, leages: countryData.leages },
    { upsert: true }
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

  if (id) {
    Country.findOneAndRemove({ id })
      .then((country) => {
        logger.info('Country has been removed');
        res.send(country);
      })
      .catch((error) => {
        logger.error(error.message);
        res.status(404).send(error.message);
      });
  } else {
    logger.error('Country with this id is not available');
    res.status(404).send('Country with this id is not available');
  }
}


// validate request body
export function validateCountry(country) {
  const countrySchema = {
    id: Joi.number().required(),
    name: Joi.string().min(3),
    leages: Joi.number()
  };

  return Joi.validate(country, countrySchema);
}
