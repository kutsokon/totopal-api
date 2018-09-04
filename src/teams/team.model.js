import mongoose, { Schema } from 'mongoose';

const TeamSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  league: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'League'
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
