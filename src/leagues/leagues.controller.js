import Joi from 'joi';

import League from './leagues.model';
import Country from '../countries/countries.model';
import logger from '../utils/logger';

// GET -> /leagues
export function getLeagues(req, res) {
  League.find()
    .populate('teams')
    .exec()
    .then(leagues => {
      if (leagues) {
        logger.info('All leagues have been got');
        res.status(200).json({ data: { leagues } });
      } else {
        logger.error('All leagues not found');
        res.status(404).json({ message: 'Not found' });
      }
    })
    .catch(error => {
      logger.error(error.message);
      res.status(404).json({ message: 'Not found' });
    });
}

// GET -> /leagues/:id
export function getLeague(req, res) {
  const { id } = req.params;

  League.findOne({ _id: id })
    .populate('teams')
    .exec()
    .then(league => {
      if (league) {
        logger.info('A country has been gotten');
        res.status(200).json({ data: { league } });
      } else {
        logger.error('A league not found');
        res.status(404).json({ message: 'Not found' });
      }
    })
    .catch(error => {
      logger.error(error.message);
      res.status(404).json({ message: 'Not found' });
    });
}

// POST -> /leagues
export function addLeague(req, res) {
  const result = validateLeague(req.body);

  if (result.error) {
    logger.error(result.error.details[0].message);
    res.status(404).json({ message: 'Wrong parameters' });
    return;
  }

  const { name, countryName, teams } = result.value;

  Country.findOne({ name: countryName })
    .then(country => {
      new League({
        name,
        country: country._id,
        teams
      })
        .save()
        .then(league => {
          country.leagues.push(league._id);
          return country.save();
        })
        .then(() => {
          logger.error('League has been created and pushed to corresponding country');
          res
            .status(201)
            .json({ message: 'League has been created and pushed to corresponding country' });
        })
        .catch(error => {
          logger.error(error.message);
          res.status(404).json({ message: 'Not found' });
        });
    })
    .catch(error => {
      logger.error(error.message);
      res.status(404).json({ message: 'Not found' });
    });
}

// PUT -> /leagues/:id
export function updateLeague(req, res) {
  const { id } = req.params;
  const result = validateLeague(req.body);

  if (result.error) {
    logger.error(result.error.details[0].message);
    res.status(404).json({ message: 'Wrong parameters' });
    return;
  }

  const { name } = result.value;

  League.findOneAndUpdate({ _id: id }, { name })
    .then(() => {
      logger.info('A league has been updated');
      res.status(200).json({ message: 'A league has been updated' });
    })
    .catch(error => {
      logger.error(error.message);
      res.status(404).json({ message: 'Not found' });
    });
}

// REMOVE -> /leagues/:id
export function removeLeague(req, res) {
  const { id } = req.params;

  League.findOneAndRemove({ _id: id })
    .then(league => {
      // remove league id from country collection
      return Country.findOneAndUpdate(
        { _id: league.country },
        { $pullAll: { leagues: [league._id] } }
      );
    })
    .then(() => {
      logger.info('A league has been removed');
      res.status(200).json({ message: 'A league has been removed' });
    })
    .catch(error => {
      logger.error(error.message);
      res.status(404).json({ message: 'Not found' });
    });
}

export function validateLeague(league) {
  const leagueSchema = {
    name: Joi.string().required(),
    countryName: Joi.string().required(),
    teams: Joi.array().items(Joi.number())
  };

  return Joi.validate(league, leagueSchema);
}
