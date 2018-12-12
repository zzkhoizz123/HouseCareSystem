/* eslint-disable */
import * as express from "express";
import * as mongoose from "mongoose";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import { factory } from "config/LoggerConfig";

import { router as user_route } from "api/v1/users";
// import {router as helper_route} from 'api/v1/helpers';
// import {router as owner_route} from 'api/v1/owners';
import { development as db_dev, production as db_prod } from "config/keys";

const app = express();
const port = process.env.PORT || 5000;
const dbLog = factory.getLogger("database.Mongo");
const routeLog = factory.getLogger("request.Route");
const db = process.env.PORT ? db_prod : db_dev;

app.use(cors());
app.use(bodyParser.json());

// Connect to Mongo
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  ) // Adding new mongo url parser
  .then(() => dbLog.info("MongoDB Connected..."))
  .catch(err => {
    // console.log(err);
    // console.log("Cannot connect to db: ${db}");
    dbLog.error(err);
    dbLog.error("Cannot connect to db: " + db);
    process.exit(1);
  });

app.use("/**", (req, res, next) => {
  routeLog.info("[" + req.method + "] " + req.originalUrl);
  routeLog.info(JSON.stringify(req.body));
  // console.log(req.body);
  next();
});
// app.use("api/", api);
app.use("/api/v1/users", user_route);
// app.use("/api/v1/helpers", helper_route);
// app.use("/api/v1/owners", owner_route);

const server = app.listen(port, () =>
  routeLog.info(`Server started on port ${port}`)
);

export { server };
