import Country from './countries.model';
import logger from '../utils/logger';
import { validateCountry } from '../utils/vaidation';

// GET -> /countries
export function getCountries(req, res) {
  Country.find()
    .then(countries => {
      logger.info('All countries have been got');
      res.send(countries);
    })
    .catch(error => {
      logger.error(error.message);
      res.status(404).send(error.message);
    });
}

// GET -> /countries/:id
export function getCountry(req, res) {
  const { id } = req.params;

  Country.findOne({ _id: id })
    .then(country => {
      logger.info('A country has been got', country);
      res.send(country);
    })
    .catch(error => {
      logger.error(error.messag);
      res.status(404).send(error.messag);
    });
}

// POST -> /countries
export function addCountry(req, res) {
  const result = validateCountry(req.body);

  if (result.error) {
    logger.error(result.error.details[0].message);
    res.status(404).send(result.error.details[0].message);
    return;
  }

  const { name, leagues } = result.value;

  Country.findOneAndUpdate({ name }, { name, leagues }, { upsert: true, new: true })
    .then(country => {
      logger.info('A country has been created', country);
      res.send(country);
    })
    .catch(error => {
      logger.error(error.message);
      res.status(404).send(error.message);
    });
}

// PUT -> /countries/:id
export function updateCountry(req, res) {
  const { id } = req.params;
  const result = validateCountry(req.body);

  if (result.error) {
    logger.error(result.error.details[0].message);
    res.status(404).send(result.error.details[0].message);
    return;
  }

  const { name, leagues } = result.value;

  Country.findOneAndUpdate(
    { _id: id },
    { name: name, leagues: leagues },
    { upsert: true, new: true }
  )
    .then(country => {
      logger.info('A country has been updated', country);
      res.send(country);
    })
    .catch(error => {
      logger.error(error.message);
      res.status(404).send(error.message);
    });
}

// DELETE -> /countries/:id
export function removeCountry(req, res) {
  const { id } = req.params;

  Country.findOneAndRemove({ _id: id })
    .then(() => {
      logger.info('A country has been removed');
      res.send('A country has been removed');
    })
    .catch(error => {
      logger.error(error.message);
      res.status(404).send(error.message);
    });
}
