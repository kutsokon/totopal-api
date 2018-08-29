import express from 'express';
import { getTeams, getTeam, addTeam, updateTeam, removeTeam } from './teams.controller';

const teams = express.Router();

teams.get('/teams', getTeams);
teams.get('/teams/:id', getTeam);
teams.post('/teams', addTeam);
teams.put('/teams/:id', updateTeam);
teams.delete('/teams/:id', removeTeam);

export default teams;
