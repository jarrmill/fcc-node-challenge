const axios = require("axios");
const Pin = require("./Models/pin");
/*
  nickname: 'Jay Moe',
  name: 'Jay Moe',
  picture: 'https://pbs.twimg.com/profile_images/946502059666292737/PGrwDUzS_normal.jpg',
  updated_at: '2018-01-09T21:14:54.333Z'? */

exports.getUserInfo = function(req){
  return new Promise(function(resolve, reject){
    const aud = req.user.aud[1];
    const auth = req.headers.authorization;
    const headers = {'Authorization' : `${auth}`}
    const url = `${aud}`

    axios.get(url , {headers})
    .then(response => {
      console.log("Received user data: ", response.data);
      resolve(response.data);
    }).catch(error => {
      reject(error);
    })
  });
}
exports.getPins = function(){
  return new Promise(function(resolve, reject){
    Pin.find(function (err, pinList){
      if (err) reject(err);
      resolve(pinList);
    })
  });
}
exports.getPinById = function(pinId){
  return new Promise(function(resolve, reject){
    Pin.find({_id: pinId}, function(err, pin){
      if (err) reject(err);
      resolve(pin);
    })
  });
}
