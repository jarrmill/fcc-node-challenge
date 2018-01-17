// dependencies -------------------
var express = require('express');
var app = express();
var jwt = require('express-jwt');
var jwks = require('jwks-rsa');
var mongoose = require('mongoose');


// --------middleware--------------
var cors = require('cors');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var multer = require('multer');


// ---------------------controllers
const Short = require('./Controllers/short');
const IMAGE_SEARCH = require('./Controllers/image_search');
const IMAGE_UPLOAD = require('./Controllers/image_upload');


// initialization
var port = process.env.PORT || 8080;
var uristring = process.env.MONGODB_URI || 'mongodb://localhost:auth/auth';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    console.log("file type:", file.mimetype);
    cb(null, Date.now() + '.jpg') //Appending .jpg
  }
})

var upload = multer({ storage: storage });

app.use(cors());
app.use(morgan('API Request (port 3001): :method :url :status :response-time'));


mongoose.connect(uristring, function(err, res){
  if (err) {
    console.log(`ERROR connecting to ${uristring} . ${err}`);
  } else {
    console.log(`Succeeded connecting to ${uristring} :) `);
  }
});

//-------------------------------
//- - - - - - - - - - - - - -  -
//-------------------------------
// Routes


app.get('/public', function (req, res) {
  res.send('Hello from a public endpoint!');
})
//delete^^^^^^^

//URL SHORTENER
//to shorten a url
app.get("/", function (req, res){
  res.send("Hello! Welcome to my page.");
})
app.get("/shortener/*", jsonParser, Short.shortener);
//already have shortened url
app.get("/short/*", jsonParser, Short.redirect)

//IMAGE SEARCH
app.get("/latest/imagesearch", IMAGE_SEARCH.latest);
app.get("/imagesearch/:query", IMAGE_SEARCH.image_search);
app.post("/imageupload", upload.single('file'), IMAGE_UPLOAD.image_upload);
console.log("SERVER: Hello! Welcome to port: ", port);
app.listen(port);
