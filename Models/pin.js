const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PinSchema = new Schema({
  userID : String,
  userName : String,
  userImg : String,
  title: String,
  imgUrl : String,
  likes : Array,
  shares : Array,
});

const Pin = mongoose.model('Pin', PinSchema);

//Export the model
module.exports = Pin;
