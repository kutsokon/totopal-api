import express from 'express';
import { getLeagues, getLeague, addLeague, updateLeague, removeLeague } from './leagues.controller';
import checkAuth from '../middleware/auth';

const leagues = express.Router();

leagues.get('/leagues', getLeagues);
leagues.get('/leagues/:id', getLeague);
leagues.post('/leagues', checkAuth, addLeague);
leagues.put('/leagues/:id', checkAuth, updateLeague);
leagues.delete('/leagues/:id', checkAuth, removeLeague);

export default leagues;
