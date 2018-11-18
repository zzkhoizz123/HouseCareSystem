const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
//const path = require('path');

const users = require('./routes/api/users');

const app = express();

const cors = require('cors');
app.use(cors());

// Bodyparser Middleware
app.use(bodyParser.json());

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to Mongo
mongoose
  .connect(db, {useNewUrlParser: true}) // Adding new mongo url parser
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

// Use Routes
app.use('/api/users', users);

const port = process.env.PORT || 5000;

app.listen(port, ()=> console.log(`Server started on port ${port}`));