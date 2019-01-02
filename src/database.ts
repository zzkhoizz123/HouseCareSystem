import * as mongoose from "mongoose";

import * as database_config from "config/database";
import { factory as LoggerFactory } from "config/LoggerConfig";

const dbLog = LoggerFactory.getLogger("database.Mongo");

// silly way to export the database
const database = () =>
  new Promise((resolve, reject) => {
    dbLog.info("Connecting MongoDB");
    mongoose.connect(
      database_config.MONGODB_URI,
      { useNewUrlParser: true },
      err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });

export default database;
