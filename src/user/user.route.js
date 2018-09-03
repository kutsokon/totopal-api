import express from 'express';
import { signUp, logIn, removeUser } from './user.controller';

const user = express.Router();

user.post('/signup', signUp);
user.get('/login', logIn);
user.delete('/user/:id', removeUser);

export default user;
