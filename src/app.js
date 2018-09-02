import chalk from 'chalk';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import Routes from './routes';
import { modifyErrorMessage, errorHandler } from './routes/error';
import logger from './utils/logger';

const app = express();
const PORT = process.env.PORT || 3000;
const mongoURI = 'mongodb://localhost:27017/totopal';

mongoose.connect(
  mongoURI,
  { useNewUrlParser: true }
);
mongoose.connection.on('error', err => {
  logger.error(err.message);
  logger.info('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});

app.use(cors());
app.use(express.json());
app.use('/v1', Routes);
app.use(modifyErrorMessage);
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`this server is listening on ${PORT}`);
});
