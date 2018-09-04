import mongoose from 'mongoose';
import chalk from 'chalk';

import logger from './utils/logger';

const mongoURI = 'mongodb://mongo:27017/totopal-api';
const RETRY_TIME = 3000;

export function connectToDatabaseWithRetry() {
  return mongoose.connect(
    mongoURI,
    err => {
      if (err) {
        logger.error(err.message);
        logger.info(
          '%s MongoDB connection error. Please make sure MongoDB is running.',
          chalk.red('✗')
        );
        setTimeout(connectToDatabaseWithRetry, RETRY_TIME);
      }
    }
  );
}
