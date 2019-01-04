import server from "server";
import database from "database";

import logger from "utils/logger";

let serverInstance;
let databaseInstance;

database()
  .catch(err => {
    logger.error("Cannot connect to MongoDB");
    // logger.error(err); // this returns undefined
    process.exit(1);
  })
  .then(db => {
    databaseInstance = db;
    logger.info("MongoDB Connected...");
    return server();
  })
  .catch(err => {
    logger.error("Cannot start server");
    logger.error(err);
    process.exit(1);
  })
  .then(s => {
    serverInstance = s;
    logger.info("Server started, on port:", serverInstance.address().port);
  });

// handling CTRL+C
process.on("SIGINT", () => {
  logger.info("Received SIGINT, closing SERVER and disconnect DATABASE");
  return new Promise(resolve => {
    serverInstance.close(() => resolve());
  })
    .then(() => {
      logger.info("SERVER closed");
      databaseInstance.disconnect();
    })
    .then(() => {
      logger.info("DATABASE disconnected");
      logger.info("LOGGER shutdowned");
      logger.shutdown();
    })
    .then(() => {
      process.exit(0);
    });
});
