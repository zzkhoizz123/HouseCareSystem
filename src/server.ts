import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as jwt from "express-jwt";
import * as gracefulShutdown from "http-graceful-shutdown";

import * as server_config from "config/server";
import logger from "utils/logger";
import RequestError from "utils/RequestError";

import { router as api } from "api/api";

const app = express();

app.use(cors());
app.use(
  jwt({ secret: server_config.TOKEN_SECRET }).unless({
    path: ["/api/v1/users/signin", "/api/v1/users/signup", "/api/v1/users/"]
  })
);
app.use(bodyParser.json());

app.use("/**", (req, res, next) => {
  logger.info("[" + req.method + "] " + req.originalUrl);
  // logger.info(JSON.stringify(req.body));
  next();
});

app.use("/api/", api);

// error handling
app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    // jwt auth error
    res.status(401);
    res.json({
      message: "Invalid Token",
      success: false,
      error: 0,
      data: {}
    });
    res.end();
  } else if (err instanceof RequestError) {
    // request error
    res.status(err.status);
    res.json({
      message: err.message,
      success: false,
      error: err.code,
      data: {}
    });
    res.end();
  } else {
    // other error
    logger.error(err);
    res.status(500);
    res.json({
      message: err,
      success: false,
      error: -1,
      data: {}
    });
    res.end();
  }
});

// silly way to export the server
const server = () =>
  new Promise((resolve, reject) => {
    logger.info("Starting Server");
    const s = app.listen(server_config.PORT, err => {
      if (err) {
        reject(err);
      } else {
        gracefulShutdown(s);
        resolve(s);
      }
    });
  });

export default server;
