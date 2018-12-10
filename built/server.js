var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
// const path = require('path');
var users = require('./api/users');
var app = express();
var cors = require('cors');
app.use(cors());
// Bodyparser Middleware
app.use(bodyParser.json());
// DB Config
var db = require('./config/keys').mongoURI;
// Connect to Mongo
mongoose
    .connect(db, {useNewUrlParser: true})  // Adding new mongo url parser
    .then(function() { return console.log('MongoDB Connected...'); })
    .catch(function(err) { return console.log(err); });
// Use Routes
app.use('/api/users', users);
var port = process.env.PORT || 5000;
app.listen(
    port, function() { return console.log('Server started on port ' + port); });
