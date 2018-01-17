const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSearchSchema = new Schema({
  query : String,
  date : String
});

const ImageSearch = mongoose.model('ImageSearch', ImageSearchSchema);

//Export the model
module.exports = ImageSearch;
