import mongoose, { Schema } from 'mongoose';

const CountrySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  leagues: {
    type: [String],
    required: true
  }
});

const Country = mongoose.model('Country', CountrySchema);

export default Country;
