import Joi from 'joi';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from './user.model';
import logger from '../utils/logger';

export function signUp(req, res) {
  const result = validateUser(req.body);

  if (result.error) {
    logger.error(result.error.details[0].message);
    res.status(404).json({ message: 'Wrong parameters' });
    return;
  }

  const { email, password } = result.value;

  bcrypt.hash(password, 10, (error, hash) => {
    if (error) {
      res.status(500).json({ message: 'Not found' });
      return;
    }

    new User({
      email,
      password: hash
    })
      .save()
      .then(() => {
        logger.info('A user has been created');
        res.status(201).json({
          message: 'A user has been created'
        });
      })
      .catch(error => {
        logger.error(error.message);
        res.status(404).json({ message: 'Not found' });
      });
  });
}

export function logIn(req, res) {
  const { email, password } = req.body;

  User.findOne({ email })
    .then(user => {
      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          const token = jwt.sign(
            {
              email: user.email,
              userId: user._id
            },
            process.env.JWT_KEY,
            {
              expiresIn: process.env.JWT_EXP
            }
          );
          res.status(200).json({ message: 'Auth successful!', token });
        } else {
          res.status(401).json({
            message: 'Auth failed'
          });
        }
      });
    })
    .catch(error => {
      logger.error(error.message);
      res.status(401).json({
        message: 'Auth failed'
      });
    });
}

export function removeUser(req, res) {
  const { id } = req.body;

  User.findOneAndRemove({ _id: id })
    .then(() => {
      logger.info('A user has been removed');
      res.status(200).json({ message: 'A user has been removed' });
    })
    .catch(error => {
      logger.error(error.message);
      res.status(404).json({ message: 'Not found' });
    });
}

function validateUser(user) {
  const userSchema = {
    email: Joi.string().required(),
    password: Joi.string().required()
  };

  return Joi.validate(user, userSchema);
}
