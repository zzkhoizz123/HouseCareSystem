import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as jwt from "express-jwt";

import * as server_config from "config/server";
import { factory as LoggerFactory } from "config/LoggerConfig";

import { router as api } from "api/api";

const app = express();
const routeLog = LoggerFactory.getLogger("request.Route");

app.use(cors());
app.use(
  jwt({ secret: server_config.TOKEN_SECRET }).unless({
    path: ["/api/v1/users/signin", "/api/v1/users/signup", "/api/v1/users/"]
  })
);
app.use(bodyParser.json());

app.use("/**", (req, res, next) => {
  routeLog.info("[" + req.method + "] " + req.originalUrl);
  // routeLog.info(JSON.stringify(req.body));
  next();
});

app.use("/api/", api);

// error handling
app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    res.status(401);
    res.json({
      message: "Invalid Token",
      success: false,
      error: 0,
      data: {}
    });
    res.end();
  } else {
    res.status(err.status);
    res.json({
      message: err.message,
      success: false,
      error: err.code,
      data: {}
    });
  }
});

// silly way to export the server
const server = () =>
  new Promise((resolve, reject) => {
    routeLog.info("Starting Server");
    const s = app.listen(server_config.PORT, err => {
      if (err) {
        reject(err);
      } else {
        resolve(s);
      }
    });
  });

export default server;
