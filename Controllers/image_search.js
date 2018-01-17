var axios = require('axios');
var moment = require('moment');
const ImageSearch = require("../Models/image_search");

exports.image_search = function(req, res, next){
  console.log("Params", req.params.query);
  console.log("Query", req.query.offset);
  const cx = "005055073079827980678:0z3xlcvaoio";
  const api_key = "AIzaSyDWUD2yMcAtAf8WfKyu_L5W7IFZAaQm8kE";
  const test_url = `https://www.googleapis.com/customsearch/v1?key=${api_key}&cx=${cx}&q=lectures`

  const root_url = `https://www.googleapis.com/customsearch/v1?key=${api_key}&cx=${cx}&q=${req.params.query}&searchtype=image&start=${req.query.offset}`;
  console.log("Root url: ", root_url);
  axios.get(root_url)
    .then(response => {
      if(response.data.items === undefined){res.status(200).send("no results found. try another phrase")}
      let results = {};
      const now = moment().format('MMMM Do YYYY, h:mm:ss a');
      response.data.items.map((item, i) => {
        results[i] = item;
      })
      const search = new ImageSearch ({
        query: req.params.query,
        date: now
      });

      search.save(function(err){
        if (err){
          return res.status(500).send("Internal server error");
        }
        res.status(200).json(results);
      });

    }).catch(error => {
      console.log("Error in axios request ", error);
      res.status(500);
    });
}

exports.latest = function(req, res, next){
  ImageSearch.find(function(err, results){
    if(err){res.status(500)}

    res.status(200).json(results);
  })
}
