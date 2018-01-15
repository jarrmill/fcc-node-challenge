const Pin = require("../Models/pin");
const helper = require('../helper_functions');

/*
userID : String,
userName : String,
title: String,
imgUrl : String,
likes : Array,
shares : Array,
*/

exports.testAuth = function(req, res, next){
  helper.getUserInfo(req);
  return res.send('Secured Resource');
};
exports.createPin = function(req, res, next) {
  const userID = req.user.sub;
  const imgUrl = req.body.imgurl;
  const title = req.body.title;

  if (!userID || !title || !imgUrl) {
    return res.status(400).send("Bad parameters");
  }
  helper.getUserInfo(req)
    .then(user => {
      const pin = new Pin ({
        userID,
        userName: user.nickname,
        userImg: user.picture,
        title,
        imgUrl,
        likes: [],
        shares: []
      });

      pin.save(function(err){
        if (err){
          return res.status(500).send("Internal server error");
        }
        console.log("New pen saved for user: ", user.nickname);

        //now that pin is saved, get all pins and return them.
        helper.getPins()
          .then(pins => {
              return res.status(200).send(pins);
            })
          .catch(error => {
            console.log("Error in createPin/getPins");
            return res.status(500).send(error);
          });
      });
  }).catch(error => {
    console.log("Error getting user info in createPin func");
    return res.status(500).send(error);
  })
};

exports.getAllPins = function(req, res, next) {
  helper.getPins()
    .then(pins => {
        return res.status(200).send(pins);
      })
    .catch(error => {
      console.log("Error in createPin/getPins");
      return res.status(500).send(error);
    });
}

exports.deletePin = function(req, res, next) {
  //check if all args are there
  const pinID = req.body.pinid;
  if (!pinID) {
    console.log("Rejecting request to delete pin: ", req.body);
    return res.status(400).send("Need pin id");
  }
  //check if user is deleting their own pin
  userInfo = helper.getUserInfo(req);
  pinInfo = helper.getPinById(pinID);

  Promise.all([userInfo, pinInfo])
    .then( values => {
      const userInfo = values[0];
      const pinInfo = values[1][0];
      console.log(userInfo.sub);
      console.log(pinInfo);

      //delete pin
      if (userInfo.sub === pinInfo.userID){
        Pin.remove({_id: pinInfo._id}, function(err){
          if(err) return res.status(500);
          helper.getPins().then(pins => {
            return res.status(200).json(pins);
          });
        })
      } else {
        console.log("user cannot delete this pin!");
        return res.status(401);
      }
    })
    .catch( error => {
      console.log("Error in deletepin promise");
      return res.status(500);
    })
}

exports.getUserPins = function(req, res, next) {
    return res.status(200).send("Howdy!");
}

exports.likePin = function(req, res, next) {
  //this will also toggle pin likes if user has already liked pin
  if(!req.body.pin){
    return res.status(400);
  }
  // 1) find whether user has already liked the pin;
  helper.getUserInfo(req)
    .then(user => {
      var pin = req.body.pin
      var user_array_index = pin.likes.indexOf(user.sub);
      console.log("Pin before: ", pin);
      if(user_array_index === -1){
        pin.likes.push(user.sub);
      } else{
        pin.likes.splice(user_array_index, 1);
      }
      Pin.update({_id: pin._id}, {likes: pin.likes}, function(err){
        if (err) res.status(500);

        helper.getPins().then(pins => {
          return res.status(200).json(pins);
        });
      });
    })
  return res.status(200);
}

exports.sharePin = function(req, res, next) {
  if (!req.body.pin){
    return res.status(400);
  }
  const user = req.user.sub;
  const pin = req.body.pin;
  //check to see if user has already shared. if so, do nothing,
  if(pin.shares.indexOf(user) === -1){
    pin.shares.push(user);
  } else {
    return res.status(200).send("no change");
  }
  //this is going to be a .then hell, need to refactor
  // update pin => get user info => create new pin => refresh pins => return pins
  Pin.update({_id: pin._id}, {shares: pin.shares}, function(err){
    if (err) res.status(500);
    var title = pin.title;
    var imgUrl = pin.imgUrl;
    helper.getUserInfo(req).then(newuser =>{
      const pin = new Pin ({
        userID: user,
        userName: newuser.nickname,
        userImg: newuser.picture,
        title: title,
        imgUrl, imgUrl,
        likes: [],
        shares: []
      });

      pin.save(function(err){
        if (err){
          return res.status(500).send("Internal server error");
        }
        console.log("New pen saved for user: ", newuser.nickname);

        //now that pin is saved, get all pins and return them.
        helper.getPins()
          .then(pins => {
              return res.status(200).send(pins);
            })
          .catch(error => {
            console.log("Error in createPin/getPins");
            return res.status(500).send(error);
          });
      });
    }).catch(error => {
      console.log("Error in share contr.", error);
      return res.status(500).send(error);
    });
  });
}
