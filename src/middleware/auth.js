import jwt from 'jsonwebtoken';

import logger from '../utils/logger';

function checkAuth(req, res, next) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY, null);
    req.userData = decoded;
    next();
  } catch (error) {
    logger.error(error.message);
    return res.status(401).json({
      message: 'Auth failed'
    });
  }
}

export default checkAuth;
