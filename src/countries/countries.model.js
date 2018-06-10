import mongoose, { Schema } from 'mongoose';

const CountrySchema = new Schema({
  name: String,
  leages: Number
});

const Country = mongoose.model('Country', CountrySchema);

export default Country;
