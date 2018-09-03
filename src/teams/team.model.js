import mongoose, { Schema } from 'mongoose';

const TeamSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  league: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  coach: {
    type: String,
    required: true
  },
  players: {
    type: [String],
    required: true
  }
});

const Team = mongoose.model('Team', TeamSchema);

export default Team;
