import Team from './team.model';
import League from '../leagues/leagues.model';
import { validateTeam } from '../utils/vaidation';
import logger from '../utils/logger';

// get -> /teams
export function getTeams(req, res) {
  Team.find().then((teams) => {
    logger.info('All teams have been gotten');
    res.send(teams);
  }).catch((error) => {
    logger.error(error.message);
    res.status(404).send(error.message);
  });
}

// get -> /teams/:id
export function getTeam(req, res) {
  const { id } = req.params;

  Team.findOne({ _id: id }).then((team) => {
    logger.info('A team has been gotten');
    res.send(team);
  }).catch((error) => {
    logger.error(error.message);
    res.status(404).send(error.message);
  });
}

// post -> /teams
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
    .then((team) => {
      // add a league to an existing country
      League.findOneAndUpdate({ name: league }, { $push: { teams: team._id } })
        .then(() => {
          logger.error('Team was created and pushed to corresponding league');
          res.send(team);
        }).catch((error) => {
          logger.error(error.message);
          res.status(404).send(error.message);
        });
    }).catch((error) => {
      logger.error(error.message);
      res.status(404).send(error.message);
    });
}

// put -> /teams/:id
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
    { upsert: true }
  )
    .then(() => {
      logger.info('A team was updated');
      res.send('A team has been updated');
    }).catch((error) => {
      logger.error(error.message);
      res.status(404).send(error.message);
    });
}

// remove -> /teams/:id
export function removeTeam(req, res) {
  const { id } = req.params;

  Team.findOneAndRemove({ _id: id }).then(() => {
    logger.info('A team was removed');
    res.send('A team was removed');
  }).catch((error) => {
    logger.error(error.message);
    res.status(404).send(error.message);
  });
}


