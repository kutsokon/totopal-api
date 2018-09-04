import express from 'express';
import cors from 'cors';

import { modifyErrorMessage, errorHandler } from './routes/error';
import { connectToDatabaseWithRetry } from './db';
import logger from './utils/logger';

const app = express();
const PORT = process.env.PORT || 3000;

connectToDatabaseWithRetry();

app.use(cors());
app.use(express.json());
app.use('/v1', Routes);
app.use(formErrorMessage);
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`this server is listening on ${PORT}`);
});
