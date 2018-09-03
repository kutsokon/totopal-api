import mongoose, { Schema } from 'mongoose';

const LeagueSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  country: {
    type: String,
    required: true
  },
  teams: {
    type: [String],
    required: true
  }
});

const League = mongoose.model('League', LeagueSchema);

export default League;
