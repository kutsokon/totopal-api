import Joi from 'joi';

import Team from './team.model';
import League from '../leagues/leagues.model';
import logger from '../utils/logger';

// get -> /teams
export function getTeams(req, res) {
  Team.find()
    .then(teams => {
      logger.info('All teams have been gotten');
      res.json({ data: { teams } });
    })
    .catch(error => {
      logger.error(error.message);
      res.status(404).json({ message: error.message });
    });
}

// get -> /teams/:id
export function getTeam(req, res) {
  const { id } = req.params;

  Team.findOne({ _id: id })
    .then(team => {
      logger.info('A team has been gotten');
      res.json({ data: { team } });
    })
    .catch(error => {
      logger.error(error.message);
      res.status(404).json({ message: error.message });
    });
}

// POST -> /teams
export function addTeam(req, res) {
  const result = validateTeam(req.body);

  if (result.error) {
    logger.error(result.error.details[0].message);
    res.status(404).json({ message: result.error.details[0].message });
    return;
  }

  const { name, league, year, coach, players } = result.value;

  new Team({
    name,
    league,
    year,
    coach,
    players
  })
    .save()
    .then(team => {
      // add a league to an existing country
      return League.findOneAndUpdate({ name: league }, { $push: { teams: team._id } });
    })
    .then(() => {
      logger.error('A team has been created and pushed to corresponding league');
      res.json({ message: 'A team has been created and pushed to corresponding league' });
    })
    .catch(error => {
      logger.error(error.message);
      res.status(404).json({ message: error.message });
    });
}

// PUT -> /teams/:id
export function updateTeam(req, res) {
  const { id } = req.params;
  const result = validateTeam(req.body);

  if (result.error) {
    logger.error(result.error.details[0].message);
    res.status(404).json({ message: result.error.details[0].message });
    return;
  }

  const { name, league, year, coach, players } = result.value;

  Team.findOneAndUpdate({ _id: id }, { name, league, year, coach, players })
    .then(() => {
      logger.info('A team has been updated');
      res.json({ message: 'A team has been updated' });
    })
    .catch(error => {
      logger.error(error.message);
      res.status(404).json({ message: error.message });
    });
}

// REMOVE -> /teams/:id
export function removeTeam(req, res) {
  const { id } = req.params;

  Team.findOneAndRemove({ _id: id })
    .then(team => {
      return League.findOneAndUpdate({ name: team.league }, { $pullAll: { teams: [team._id] } });
    })
    .then(() => {
      logger.info('A team has been removed');
      res.json({ message: 'A team has been removed' });
    })
    .catch(error => {
      logger.error(error.message);
      res.status(404).json({ message: error.message });
    });
}

export function validateTeam(team) {
  const teamSchema = {
    name: Joi.string().required(),
    league: Joi.string().required(),
    year: Joi.number().required(),
    coach: Joi.string().required(),
    players: Joi.array().items(Joi.string())
  };

  return Joi.validate(team, teamSchema);
}
