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
  const address = req.body.address;
  const DoB = req.body.DoB;
  const experience = req.body.experience;
  const sex = req.body.sex;
  let role = req.body.role;

  console.log("name: %s, password: %s, username:%s, email: %s address: %s, role: %s", 
              !name, 
              !password, 
              !username, 
              !email,
              !address, 
              !role);
              

  if (!name || !email || !username || !password || !address) {
    res.status(200);
    return res.json({
      message: "Missing required field (name, email, username, password,address)",
      success: false,
      error: 0,
      data: {}
    });
  }

  if (role == null) {
    role = 1;
  }

  UserModel.CreateNewUser(username, password, name, email, address, DoB, experience, sex, role)
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

router.post("/reset_password", (req, res) => {
  const name = req.body.username;
  const pass = req.body.password;
  const newpass = req.body.new_password;

  if (!name || !pass || !newpass) {
    res.json({
      message: "no username or password or newPassword",
      success: false,
      error: 1,
      data: {}
    });
    res.end();
    return;
  }

  UserModel.ResetPassword(name, pass, newpass)
    .then(result => {
      res.status(200);
      return res.json({
        message: "Success Reset Password",
        success: true,
        error: 0,
        data: {}
      });
    })
    .catch(msg => {
      res.status(200);
      return res.json({
        message: msg,
        success: false,
        error: 0,
        data: {}
      });
    });
});


router.post("/get_worker", (req, res) => {

  if(req.user.role !== 0){
    res.status(200);
    return res.json({
      message: "You are not Owner",
      success: false,
      error: 0,
      data: {}
    });
  }

  UserModel.GetWorker()
    .then(result => {
      res.status(200);
      return res.json({
        message: "Success Get Worker",
        success: true,
        error: 0,
        data: result
      });
    })
    .catch(msg => {
      res.status(200);
      return res.json({
        message: msg,
        success: false,
        error: 0,
        data: {}
      });
    });
});

export { router };
