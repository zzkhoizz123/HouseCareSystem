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
  jwt({ secret: "secret" }).unless({
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
