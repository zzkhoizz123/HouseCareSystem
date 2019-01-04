import * as mongoose from "mongoose";

import * as database_config from "config/database";
import logger from "utils/logger";

// silly way to export the database
const database = () =>
  new Promise((resolve, reject) => {
    logger.info("Connecting MongoDB");
    const db = mongoose.connect(
      database_config.MONGODB_URI,
      { useNewUrlParser: true },
      err => {
        if (err) {
          reject(err);
        } else {
          resolve(db);
        }
      }
    );
  });

export default database;
