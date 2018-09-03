import Joi from 'joi';
import bcrypt from 'bcrypt';

import User from './user.model';
import logger from '../utils/logger';

export function signUp(req, res) {
  const result = validateUser(req.body);

  if (result.error) {
    logger.error(result.error.details[0].message);
    res.status(404).json({ message: result.error.details[0].message });
    return;
  }

  const { email, password } = result.value;

  bcrypt.hash(password, 10, (error, hash) => {
    if (error) {
      res.status(500).json({ message: error.message });
    } else {
      const user = new User({
        email,
        password: hash
      });

      user
        .save()
        .then(() => {
          logger.info('A user has been created');
          res.status(201).json({
            message: 'A user has been created'
          });
        })
        .catch(error => {
          logger.error(error.message);
          res.status(404).json({ message: error.message });
        });
    }
  });
}

export function removeUser(req, res) {
  const { id } = req.body;

  User.findOneAndRemove({ _id: id })
    .then(() => {
      logger.info('A user has been removed');
      res.json({ message: 'A user has been removed' });
    })
    .catch(error => {
      logger.error(error.message);
      res.status(404).json({ message: error.message });
    });
}

export function logIn(req, res) {}

function validateUser(user) {
  const userSchema = {
    email: Joi.string().required(),
    password: Joi.string().required()
  };

  return Joi.validate(user, userSchema);
}
