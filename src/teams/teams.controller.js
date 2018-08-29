import Team from './team.model';
import League from '../leagues/leagues.model';
import { validateTeam } from '../utils/vaidation';
import logger from '../utils/logger';

// get -> /teams
export function getTeams(req, res) {
  Team.find()
    .then(teams => {
      logger.info('All teams have been gotten');
      res.send(teams);
    })
    .catch(error => {
      logger.error(error.message);
      res.status(404).send(error.message);
    });
}

// get -> /teams/:id
export function getTeam(req, res) {
  const { id } = req.params;

  Team.findOne({ _id: id })
    .then(team => {
      logger.info('A team has been gotten');
      res.send(team);
    })
    .catch(error => {
      logger.error(error.message);
      res.status(404).send(error.message);
    });
}

// POST -> /teams
export function addTeam(req, res) {
  const result = validateTeam(req.body);

  if (result.error) {
    logger.error(result.error.details[0].message);
    res.status(404).send(result.error.details[0].message);
    return;
  }

  const { name, league, year, coach, players } = result.value;

  Team.findOneAndUpdate(
    { name },
    { name, league, year, coach, players },
    { upsert: true, new: true }
  )
    .then(team => {
      // add a league to an existing country
      League.findOneAndUpdate({ name: league }, { $push: { teams: team._id } })
        .then(() => {
          logger.error('A team has been created and pushed to corresponding league');
          res.send(team);
        })
        .catch(error => {
          logger.error(error.message);
          res.status(404).send(error.message);
        });
    })
    .catch(error => {
      logger.error(error.message);
      res.status(404).send(error.message);
    });
}

// PUT -> /teams/:id
export function updateTeam(req, res) {
  const { id } = req.params;
  const result = validateTeam(req.body);

  if (result.error) {
    logger.error(result.error.details[0].message);
    res.status(404).send(result.error.details[0].message);
    return;
  }

  const { name, league, year, coach, players } = result.value;

  Team.findOneAndUpdate(
    { _id: id },
    { name, league, year, coach, players },
    { upsert: true, new: true }
  )
    .then(team => {
      logger.info('A team has been updated');
      res.send(team);
    })
    .catch(error => {
      logger.error(error.message);
      res.status(404).send(error.message);
    });
}

// REMOVE -> /teams/:id
export function removeTeam(req, res) {
  const { id } = req.params;

  Team.findOneAndRemove({ _id: id })
    .then(team => {
      League.findOneAndUpdate({ name: team.league }, { $pullAll: { teams: [team._id] } })
        .then(() => {
          logger.info('A team has been removed');
          res.send('A team has been removed');
        })
        .catch(error => {
          logger.error(error.message);
          res.status(404).send(error.message);
        });
    })
    .catch(error => {
      logger.error(error.message);
      res.status(404).send(error.message);
    });
}
