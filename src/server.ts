/* eslint-disable */
import express = require('express');
import mongoose = require('mongoose');
import bodyParser = require('body-parser');
import cors = require('cors');
import {factory} from './config/LoggerConfig';

import {router as user_route} from './api/v1/users';
import {development as db_dev, production as db_prod} from './config/keys';

const app = express();
const port = process.env.PORT || 5000;
const dbLog = factory.getLogger("database.Mongo");
const routeLog = factory.getLogger("request.Route");
const db = process.env.PORT ? db_prod : db_dev;

app.use(cors());
app.use(bodyParser.json());

// Connect to Mongo
mongoose
    .connect(db, {useNewUrlParser: true})  // Adding new mongo url parser
    .then(() => dbLog.info('MongoDB Connected...'))
    .catch(err => {
        // console.log(err);
        // console.log("Cannot connect to db: ${db}");
        dbLog.error(err);
        dbLog.error("Cannot connect to db: " + db);
        process.exit(1);
    });

app.use('/api/users', user_route);

app.listen(port, () => routeLog.info(`Server started on port ${port}`));
