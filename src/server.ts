/* eslint-disable */
import express = require('express');
import mongoose = require('mongoose');
import bodyParser = require('body-parser');
import cors = require('cors');

import {router as user_route} from './api/v1/users';
import {development as db_dev, production as db_prod} from './config/keys';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Connect to Mongo
let db = '';
if (process.env.PORT) {
    db = db_prod;
} else {
    db = db_dev;
}
mongoose
    .connect(db, {useNewUrlParser: true})  // Adding new mongo url parser
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => {
        // console.log(err);
        console.log("Cannot connect to db: ${db}");
    });

app.use('/api/users', user_route);

app.listen(port, () => console.log(`Server started on port ${port}`));
