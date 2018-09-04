import mongoose, { Schema } from 'mongoose';

const LeagueSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  country: { type: mongoose.Schema.Types.ObjectId, ref: 'Country' },
  teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }]
});

const League = mongoose.model('League', LeagueSchema);

export default League;
