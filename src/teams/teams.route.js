import express from 'express';
import { getTeams, getTeam, addTeam, updateTeam, removeTeam } from './teams.controller';
import checkAuth from '../middleware/auth';

const teams = express.Router();

teams.get('/teams', getTeams);
teams.get('/teams/:id', getTeam);
teams.post('/teams', checkAuth, addTeam);
teams.put('/teams/:id', checkAuth, updateTeam);
teams.delete('/teams/:id', checkAuth, removeTeam);

export default teams;
