import express from 'express';

export const leagues = express.Router();

leagues.get('/', (req, res) => {
  res.send('Hello world leagues');
});

export default leagues;
