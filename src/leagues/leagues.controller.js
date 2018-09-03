import Joi from 'joi';

import League from './leagues.model';
import Country from '../countries/countries.model';
import logger from '../utils/logger';

// GET -> /leagues
export function getLeagues(req, res) {
  League.find()
    .then(leagues => {
      logger.info('All leagues have been got');
      res.json({ data: { leagues } });
    })
    .catch(error => {
      logger.error(error.message);
      res.status(404).json({ message: error.message });
    });
}

// GET -> /leagues/:id
export function getLeague(req, res) {
  const { id } = req.params;

  League.findOne({ _id: id })
    .then(league => {
      logger.info('A country has been gotten');
      res.json({ data: { league } });
    })
    .catch(error => {
      logger.error(error.message);
      res.status(404).json({ message: error.message });
    });
}

// POST -> /leagues
export function addLeague(req, res) {
  const result = validateLeague(req.body);

  if (result.error) {
    logger.error(result.error.details[0].message);
    res.status(404).json({ message: result.error.details[0].message });
    return;
  }

  const { name, country, teams } = result.value;

  new League({
    name,
    country,
    teams
  })
    .save()
    .then(league => {
      // add league's id to the corresponding country
      return Country.findOneAndUpdate({ name: country }, { $push: { leagues: league._id } });
    })
    .then(() => {
      logger.error('League has been created and pushed to corresponding country');
      res.json({ message: 'League has been created and pushed to corresponding country' });
    })
    .catch(error => {
      logger.error(error.message);
      res.status(404).json({ message: error.message });
    });
}

// PUT -> /leagues/:id
export function updateLeague(req, res) {
  const { id } = req.params;
  const result = validateLeague(req.body);

  if (result.error) {
    logger.error(result.error.details[0].message);
    res.status(404).json({ message: result.error.details[0].message });
    return;
  }

  const { name, country, teams } = result.value;

  League.findOneAndUpdate({ _id: id }, { name, country, teams })
    .then(() => {
      logger.info('A league has been updated');
      res.json({ message: 'A league has been updated' });
    })
    .catch(error => {
      logger.error(error.message);
      res.status(404).json({ message: error.message });
    });
}

// REMOVE -> /leagues/:id
export function removeLeague(req, res) {
  const { id } = req.params;

  League.findOneAndRemove({ _id: id })
    .then(league => {
      // remove league id from country collection
      return Country.findOneAndUpdate(
        { name: league.country },
        { $pullAll: { leagues: [league._id] } }
      );
    })
    .then(() => {
      logger.info('A league has been removed');
      res.json({ message: 'A league has been removed' });
    })
    .catch(error => {
      logger.error(error.message);
      res.status(404).json({ message: error.message });
    });
}

export function validateLeague(league) {
  const leagueSchema = {
    name: Joi.string().required(),
    country: Joi.string().required(),
    teams: Joi.array().items(Joi.number())
  };

  return Joi.validate(league, leagueSchema);
}
