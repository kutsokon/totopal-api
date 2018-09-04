import Joi from 'joi';

import Team from './team.model';
import League from '../leagues/leagues.model';
import logger from '../utils/logger';

// get -> /teams
export function getTeams(req, res) {
  Team.find()
    .then(teams => {
      if (teams) {
        logger.info('All teams have been gotten');
        res.status(200).json({ data: { teams } });
      } else {
        logger.error('All teams not found');
        res.status(404).json({ message: 'Not found' });
      }
    })
    .catch(error => {
      logger.error(error.message);
      res.status(404).json({ message: 'Not found' });
    });
}

// get -> /teams/:id
export function getTeam(req, res) {
  const { id } = req.params;

  Team.findOne({ _id: id })
    .then(team => {
      if (team) {
        logger.info('A team has been gotten');
        res.status(200).json({ data: { team } });
      } else {
        logger.error('A team not found');
        res.status(404).json({ message: 'Not found' });
      }
    })
    .catch(error => {
      logger.error(error.message);
      res.status(404).json({ message: 'Not found' });
    });
}

// POST -> /teams
export function addTeam(req, res) {
  const result = validateTeam(req.body);

  if (result.error) {
    logger.error(result.error.details[0].message);
    res.status(404).json({ message: 'Wrong parameters' });
    return;
  }

  const { name, leagueName, year, coach, players } = result.value;

  League.findOne({ name: leagueName })
    .then(league => {
      new Team({
        name,
        league: league._id,
        year,
        coach,
        players
      })
        .save()
        .then(team => {
          league.teams.push(team._id);
          return league.save();
        })
        .then(() => {
          logger.error('A team has been created and pushed to corresponding league');
          res
            .status(200)
            .json({ message: 'A team has been created and pushed to corresponding league' });
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

// PUT -> /teams/:id
export function updateTeam(req, res) {
  const { id } = req.params;
  const result = validateTeam(req.body);

  if (result.error) {
    logger.error(result.error.details[0].message);
    res.status(404).json({ message: 'Wrong parameters' });
    return;
  }

  const { name, year, coach, players } = result.value;

  Team.findOneAndUpdate({ _id: id }, { name, year, coach, players })
    .then(() => {
      logger.info('A team has been updated');
      res.status(200).json({ message: 'A team has been updated' });
    })
    .catch(error => {
      logger.error(error.message);
      res.status(404).json({ message: 'Not found' });
    });
}

// REMOVE -> /teams/:id
export function removeTeam(req, res) {
  const { id } = req.params;

  Team.findOneAndRemove({ _id: id })
    .then(team => {
      return League.findOneAndUpdate({ _id: team.league }, { $pullAll: { teams: [team._id] } });
    })
    .then(() => {
      logger.info('A team has been removed');
      res.status(200).json({ message: 'A team has been removed' });
    })
    .catch(error => {
      logger.error(error.message);
      res.status(404).json({ message: 'Not found' });
    });
}

export function validateTeam(team) {
  const teamSchema = {
    name: Joi.string().required(),
    leagueName: Joi.string().required(),
    year: Joi.number().required(),
    coach: Joi.string().required(),
    players: Joi.array().items(Joi.string())
  };

  return Joi.validate(team, teamSchema);
}
