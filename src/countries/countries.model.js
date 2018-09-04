import mongoose, { Schema } from 'mongoose';

const CountrySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  leagues: [{ type: mongoose.Schema.Types.ObjectId, ref: 'League' }]
});

const Country = mongoose.model('Country', CountrySchema);

export default Country;
