import { Router } from 'express';
import { getLeagues, getLeague, addLeague, updateLeague, removeLeague } from './leagues.controller';

const leagues = Router();

leagues.get('/leagues', getLeagues);
leagues.get('/leagues/:id', getLeague);
leagues.post('/leagues', addLeague);
leagues.put('/leagues/:id', updateLeague);
leagues.delete('/leagues/:id', removeLeague);
