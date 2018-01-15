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


// ---------------------controllers
const Pins = require('./Controllers/pins');


// initialization
var port = process.env.PORT || 8080;
var uristring = process.env.MONGODB_URI || 'mongodb://localhost:auth/auth';
var jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: "https://jmillie.auth0.com/.well-known/jwks.json"
    }),
    audience: 'http://localhost:3090',
    issuer: "https://jmillie.auth0.com/",
    algorithms: ['RS256']
});


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

//to delete vvv
app.get('/authorized', jwtCheck, Pins.testAuth);

app.get('/public', function (req, res) {
  res.send('Hello from a public endpoint!');
})
//delete^^^^^^^
app.get("/getallpins", Pins.getAllPins);
app.get("/getuserpins", Pins.getUserPins);

app.post("/createpin", jwtCheck, jsonParser, Pins.createPin);
app.post("/likepin", jwtCheck, jsonParser, Pins.likePin);
app.post("/sharepin", jwtCheck, jsonParser, Pins.sharePin);
app.post("/deletepin", jwtCheck, jsonParser, Pins.deletePin);

console.log("SERVER: Hello! Welcome to port: ", port);
app.listen(port);
