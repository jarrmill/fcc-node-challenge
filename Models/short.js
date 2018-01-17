const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ShortSchema = new Schema({
  originalUrl : String,
  shortUrl : String
});

const Short = mongoose.model('Short', ShortSchema);

//Export the model
module.exports = Short;
