var validUrl = require('valid-url');
const Short = require("../Models/short");

exports.shortener = function(req, res, next){
  var originalUrl = req.params[0];
  if (validUrl.isUri(originalUrl)){
    const root_url = "https://js-fcc-node-challenges.herokuapp.com/";
    //2. Check if URL is already in database
    urlFetcher(originalUrl).then(urlObj => {
      //3. If URL exists, send new url
      if(urlObj[0] !== undefined){
        var resultObj = urlObj[0];
        res.status(200).json({original_url: resultObj.originalUrl,
                              short_url: resultObj.shortUrl});
      }else{
        console.log(originalUrl, " is not in our system");
        var shortUrl = urlGenerator();
        const newShortUrl = new Short ({
          originalUrl,
          shortUrl,
        });

        newShortUrl.save(function(err){
          if (err){
            return res.status(500).send("Internal server error");
          }
          res.status(200).json({original_url: originalUrl,
                                short_url: `${root_url}/short/${shortUrl}`});
        });
      }
    }).catch(error => {
      console.log("Error in existCheck. ", error);
      res.send(500);
    })
  }
}

exports.redirect = function(req, res, next){
  console.log("Redirect request received");
  var shortUrl = req.params[0];
  console.log("Parameters: ", shortUrl)
  if(!shortUrl) res.status(400);

  Short.find({shortUrl}, function(err, result){
    if (err) res.status(500);

    if(result[0] === undefined){

       res.send("Nothing found :'()'");
    } else{
      console.log(result[0].originalUrl);
      res.redirect(result[0].originalUrl);
    }
  });
}
function urlFetcher(url){
  return new Promise(function(resolve, reject){
    Short.find({originalUrl:url}, function (err, urlObj){
      if (err) reject(err);
      resolve(urlObj);
    })
  });
}
//check to see if randomly generated url already exists
function doesShortenedExist(number){
  return new Promise(function(resolve, reject){
    Short.find({shortUrl:url}, function (err, urlObj){
      if (err) reject(err);
      if(urlObj[0] !== undefined){
        resolve(true);
      }
      resolve(false);
    });
  });
}
function urlGenerator(){
  //here is a bad way to generate a url. i'm going to skip this and
  //do a worse way (no checks);
  /*var isNumberGood = false;
  var finalUrl;
  while (!isNumberGood){
    var randNum = Math.floor(Math.random() * 100000);
    doesShortenedExist(randNum).then(shortenedExists => {
      if(!shortenedExists){
        finalUrl = randNum;
        isNumberGood = true;
      }
    });
  }
  return finalUrl;*/

  //worse way
  return Math.floor(Math.random() * 100000);
}
