import { Router } from "express";
import * as UserModel from "models/UserModel";
import * as jwt from "jsonwebtoken";

import RequestError from "utils/RequestError";
import logger from "utils/logger";

const router = Router();

/**
 * POST: /signup
 *     @param name: UserModel Register Name
 *     @param email: UserModel Register Email
 *     @param username: UserModelname on System
 *     @param password: UserModel's password
 */
router.post("/signup", (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const sex = req.body.sex;
  const DoB = req.body.DoB;
  const experience = req.body.experience;
  //const salt = req.body.salt;
  const address = req.body.address;
  let walletAddress = req.body.walletAddress;
  let role = req.body.role;

  if(!walletAddress){
    walletAddress = null;
  }

  if (!name || !email || !username || !password) {
    next(new RequestError(0, "Missing required field", 200));
    return;
  }

  if (role == null) {
    role = 1;
  }

  UserModel.CreateNewUser(username, password, name, email, role, sex, address, DoB, experience, walletAddress)
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
      next(new RequestError(0, "Cannot create user", 200));
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

router.post("/walletAddress",(req, res, next)=>{
  const walletAddress = req.body.walletAddress;
  const userId = req.user.id;

  if(!walletAddress){
    if (!walletAddress) {
      next(new RequestError(0, "Missing required field", 200));
      return;
    }
  }

  UserModel.AddWalletAddress(userId, walletAddress)
    .then(result=>{
      res.status(200);
      return res.json({
        message: "Success Add Wallet address",
        success: true,
        error: 0,
        data: result
      });
    })
    .catch(msg=>{
      return res.json({
        message: msg,
        success: false,
        error: 0,
        data: {}
      });
    });
});

export { router };
