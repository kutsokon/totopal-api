import Joi from 'joi';

import Country from './countries.model';
import logger from '../utils/logger';

// GET -> /countries
export function getCountries(req, res) {
  Country.find()
    .populate('leagues')
    .exec()
    .then(countries => {
      if (countries) {
        logger.info('All countries have been got');
        res.status(200).json({ data: { countries } });
      } else {
        logger.error('All countries not found');
        res.status(404).json({ message: 'Not found' });
      }
    })
    .catch(error => {
      logger.error(error.message);
      res.status(404).json({ message: 'Not found' });
    });
}

// GET -> /countries/:id
export function getCountry(req, res) {
  const { id } = req.params;

  Country.findOne({ _id: id })
    .populate('leagues')
    .exec()
    .then(country => {
      if (country) {
        logger.info('A country has been got');
        res.status(200).json({ data: { country } });
      } else {
        logger.error('A country not found');
        res.status(404).json({ message: 'Not found' });
      }
    })
    .catch(error => {
      logger.error(error.message);
      res.status(404).json({ message: 'Not found' });
    });
}

// POST -> /countries
export function addCountry(req, res) {
  const result = validateCountry(req.body);

  if (result.error) {
    logger.error(result.error.details[0].message);
    res.status(404).json({ message: 'Wrong parameters' });
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
      res.status(201).json({ message: 'A country has been created' });
    })
    .catch(error => {
      logger.error(error.message);
      res.status(404).json({ message: 'Not found' });
    });
}

// PUT -> /countries/:id
export function updateCountry(req, res) {
  const { id } = req.params;
  const result = validateCountry(req.body);

  if (result.error) {
    logger.error(result.error.details[0].message);
    res.status(404).json({ message: 'Wrong parameters' });
    return;
  }

  const { name } = result.value;

  Country.findOneAndUpdate({ _id: id }, { name: name })
    .then(() => {
      logger.info('A country has been updated');
      res.status(200).json({ message: 'A country has been updated' });
    })
    .catch(error => {
      logger.error(error.message);
      res.status(404).json({ message: 'Not found' });
    });
}

// DELETE -> /countries/:id
export function removeCountry(req, res) {
  const { id } = req.params;

  Country.findOneAndRemove({ _id: id })
    .then(() => {
      logger.info('A country has been removed');
      res.status(200).json({ message: 'A country has been removed' });
    })
    .catch(error => {
      logger.error(error.message);
      res.status(404).json({ message: 'Not found' });
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
