import Joi from 'joi';

export function validateCountry(country) {
  const countrySchema = {
    name: Joi.string().min(3).required(),
    leagues: Joi.array().items(Joi.number())
  };

  return Joi.validate(country, countrySchema);
}

export function validateLeague(league) {
  const leagueSchema = {
    name: Joi.string().required(),
    country: Joi.string().required(),
    teams: Joi.array().items(Joi.number())
  };

  return Joi.validate(league, leagueSchema);
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
