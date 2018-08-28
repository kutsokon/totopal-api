import Joi from 'joi';

import League from './leagues.model';
import Country from '../countries/countries.model';
import logger from '../utils/logger';

// get -> /leagues
export function getLeagues(req, res) {
  League.find().then((leagues) => {
    logger.info('All leagues have been gotten');
    res.send(leagues);
  }).catch((error) => {
    logger.error(error.message);
    res.status(404).send(error.message);
  });
}

// get -> /leagues/:id
export function getLeague(req, res) {
  const { id } = req.params;

  League.findOne({ _id: id }).then((league) => {
    logger.info('A country has been gotten');
    res.send(league);
  }).catch((error) => {
    logger.error(error.message);
    res.status(404).send(error.message);
  });
}

// post -> /leagues
export function addLeague(req, res) {
  const result = validateLeague(req.body);

  if (result.error) {
    logger.error(result.error.details[0].message);
    res.status(404).send(result.error.details[0].message);
    return;
  }

  const { name, country, teams } = result.value;

  League.findOneAndUpdate({ name }, { name, country, teams }, { upsert: true, new: true })
    .then((league) => {
      // add a league to an existing country
      Country.findOneAndUpdate({ name: country }, { $push: { leagues: league._id } })
        .then(() => {
          logger.error('League was created and pushed to corresponding country');
          res.send(league);
        }).catch((error) => {
          logger.error(error.message);
          res.status(404).send(error.message);
        });
    }).catch((error) => {
      logger.error(error.message);
      res.status(404).send(error.message);
    });
}

// put -> /leagues/:id
export function updateLeague(req, res) {
  const { id } = req.params;
  const result = validateLeague(req.body);

  if (result.error) {
    logger.error(result.error.details[0].message);
    res.status(404).send(result.error.details[0].message);
    return;
  }

  const { name, country, teams } = result.value;

  League.findOneAndUpdate({ _id: id }, { name, country, teams }, { upsert: true }).then(() => {
    logger.info('A league was updated');
    res.send('A league has been updated');
  }).catch((error) => {
    logger.error(error.message);
    res.status(404).send(error.message);
  });
}

// remove -> /leagues/:id
export function removeLeague(req, res) {
  const { id } = req.params;

  League.findOneAndRemove({ _id: id }).then((league) => {
    logger.info('A league was removed');
    res.send(league);
  }).catch((error) => {
    logger.error(error.message);
    res.status(404).send(error.message);
  });
}

function validateLeague(league) {
  const leagueSchema = {
    name: Joi.string().required(),
    country: Joi.string().required(),
    teams: Joi.array().items(Joi.number())
  };

  return Joi.validate(league, leagueSchema);
}
