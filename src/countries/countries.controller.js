import Joi from 'joi';
import _ from 'lodash';

import Country from './countries.model';

const countriesData = require('./countries.data');

function getCountries(req, res) {
  res.send(countriesData);
}

function getCountry(req, res) {
  const id = parseInt(req.params.id, 10);
  const country = _.find(countriesData, { id });

  if (!country) {
    res.status(404).send('The country with given id is not available');
  } else {
    res.send(country);
  }
}

function addCountry(req, res) {
  const result = validateCountry(req.body);

  if (result.error) {
    res.status(404).send(result.error.details[0].message);
    return;
  }

  const { name, leages } = result.value;
  const newCountry = Country({
    name,
    leages
  });

  // save the country
  newCountry.save((err, doc) => {
    if (err) {
      res.status(404).send(err.message);
    } else {
      res.send(doc);
    }
  });
}

function updateCountry(req, res) {
  const id = parseInt(req.params.id, 10);
  const countryToUpdate = _.find(countriesData, { id });

  if (!countryToUpdate) {
    res.status(404).send('Country with this id is not available');
    return;
  }

  const { error } = validateCountry(req.body);

  if (error) {
    res.status(404).send(error.details[0].message);
    return;
  }

  countryToUpdate.name = req.body.name;
  res.send(countryToUpdate);
}

function validateCountry(country) {
  const countrySchema = {
    id: Joi.number(),
    name: Joi.string()
      .min(3)
      .required(),
    leages: Joi.number()
  };

  return Joi.validate(country, countrySchema);
}

function removeCountry(req, res) {
  const id = parseInt(req.params.id, 10);
  const countryToRemove = _.find(countriesData, { id });

  if (!countryToRemove) {
    res.status(404).send('Country with this id is not available');
    return;
  }

  const index = countriesData.indexOf(countryToRemove);
  countriesData.splice(index, 1);

  res.send(countryToRemove);
}

module.exports = {
  getCountries,
  getCountry,
  addCountry,
  updateCountry,
  removeCountry
};
