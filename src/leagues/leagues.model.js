import mongoose, { Schema } from 'mongoose';

const LeagueSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  teams: {
    type: [Number],
    required: true
  }
});

const League = mongoose.model('League', LeagueSchema);

export default League;
