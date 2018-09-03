import mongoose, { Schema } from 'mongoose';

const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: emailRegex
  },
  password: {
    type: String,
    required: true
  }
});

const User = mongoose.model('User', UserSchema);

export default User;
