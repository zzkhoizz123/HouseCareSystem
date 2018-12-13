import { Router } from "express";
import * as UserModel from "models/UserModel";
import * as jwt from "jsonwebtoken";

import { factory } from "config/LoggerConfig";
const dbLog = factory.getLogger("database.Mongo");
const routeLog = factory.getLogger("request.Route");
const router = Router();

/**
 * POST: /signup
 *     @param name: UserModel Register Name
 *     @param email: UserModel Register Email
 *     @param username: UserModelname on System
 *     @param password: UserModel's password
 */
router.post("/signup", (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  let role = req.body.role;

  if (!name || !email || !username || !password) {
    res.status(200);
    return res.json({
      message: "Missing required field (name, email, username, password)",
      success: false,
      error: 0,
      data: {}
    });
  }

  if (role == null) {
    role = 1;
  }

  UserModel.CreateNewUser(username, password, name, email, role)
    .then(msg => {
      res.status(200);
      res.json({
        message: msg,
        success: true,
        error: 0,
        data: {}
      });
    })
    .catch(msg => {
      res.status(200);
      res.json({
        message: msg,
        success: false,
        error: 0,
        data: {}
      });
    });
});

router.post("/signin", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  UserModel.VerifyUser(username, password)
    .then(user => {
      const token = jwt.sign(user, "secret");
      user["token"] = token;
      res.status(200);
      res.json({
        message: "Login success",
        success: true,
        error: 0,
        data: user
      });
    })
    .catch(msg => {
      res.status(200);
      res.json({
        message: msg,
        success: false,
        error: 0,
        data: {}
      });
    });
});

router.get("/:id", (req, res) => {
  const id = req.params.id;
  UserModel.GetUserByID(id)
    .then(data => {
      res.status(200);
      res.json({
        message: "User with Id: " + id + " info",
        success: true,
        error: 0,
        data
      });
    })
    .catch(msg => {
      res.status(200);
      res.json({
        message: msg,
        success: false,
        error: 0,
        data: {}
      });
    });
});

export { router };
