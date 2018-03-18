const Joi = require('joi');
const _ = require('lodash');

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

  countriesData.push({
    id: countriesData.length + 1,
    name: result.name
  });

  res.send('Country');
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
    name: Joi.string()
      .min(3)
      .required()
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
