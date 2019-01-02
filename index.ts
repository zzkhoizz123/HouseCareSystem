import server from "server";
import database from "database";

import { factory as LoggerFactory } from "config/LoggerConfig";

const dbLog = LoggerFactory.getLogger("database.Mongo");
const routeLog = LoggerFactory.getLogger("request.Route");

let serverInstance;

database()
  .catch(err => {
    dbLog.error("Cannot connect to MongoDB");
    dbLog.error(err);
  })
  .then(() => {
    dbLog.info("MongoDB Connected...");
    return server();
  })
  .catch(err => {
    routeLog.error("Cannot start server");
    routeLog.error(err);
  })
  .then(s => {
    serverInstance = s;
    routeLog.info("Server started");
  });
