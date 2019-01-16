import { Router } from "express";
import * as UserModel from "models/UserModel";
import * as jwt from "jsonwebtoken";

import RequestError from "utils/RequestError";
import ConvertDate from "utils/ConvertDate";
import logger from "utils/logger";

const router = Router();

/**
 * POST: /signup
 *     @param name:          string, Compulsory, "user"
 *     @param email:         string, Compulsory, "user@gmail.com" 
 *     @param username:      string, Compulsory, "user"
 *     @param password:      string, Compulsory, "123"
 *     @param sex:           string, optional, "male"
 *     @param DoB:           string, optional, "10/10/2000"
 *     @param experience:    number, optional, 1, year
 *     @param address:       string, optional, "thu duc"
 *     @param walletAddress: string, optional, "11111"
 *     @param role:          number, optional, 1
 */
router.post("/signup", (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  let sex = req.body.sex;
  let DoB = req.body.DoB;
  let experience = req.body.experience;
  let address = req.body.address;
  let walletAddress = req.body.walletAddress;
  let role = req.body.role;

  if(!walletAddress){
    walletAddress = null;
  }

  if (!sex){
    sex = null;
  }

  if (!DoB){
    DoB = null;
  }
  else{
    DoB = ConvertDate(DoB);
  }

  if(!experience){
    experience = null;
  }

  if(!address){
    address = null;
  }

  if (!name || !email || !username || !password) {
    next(new RequestError(0, "Missing required field", 200));
    return;
  }

  if (role == null) {
    role = 1;
  }

  UserModel.CreateNewUser(username, password, name, email, role, sex, address, DoB , experience, walletAddress)
    .then(data => {
      res.status(200);
      res.json({
        message: "Signup Success",
        success: true,
        error: 0,
        data
      });
    })
    .catch(msg => {
      next(new RequestError(0, msg, 200));
      return;
    });
});

/**
 * POST: /signin
 *     @param username:      string, Compulsory, "user"
 *     @param password:      string, Compulsory, "123"
 */
router.post("/signin", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password){
    next(new RequestError(0, "Missing reuired fields", 200));
    return;
  }

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
      next(new RequestError(0, msg, 200));
      return;
    });
});

/**
 * GET: /:id
 */
router.get("/:id", (req, res, next) => {
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
      next(new RequestError(0, msg, 200));
      return;
    });
});

/**
 * POST: /reset_password
 *     @param username:      string, Compulsory, "user"
 *     @param password:      string, Compulsory, "123"
 *     @param newpass:       string, Compulsory, "123"
 */
router.post("/reset_password", (req, res, next) => {
  const name = req.body.username;
  const pass = req.body.password;
  const newpass = req.body.new_password;

  if(!name || !pass || !newpass){
    next(new RequestError(0, "Missing required fields", 200));
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
      next(new RequestError(0, msg, 200));
      return;
    });
});

/**
 * POST: /walletAddress
 *     @param walletAddress:    string, Compulsory, "11111"
 */
router.post("/walletAddress",(req, res, next)=>{
  const walletAddress = req.body.walletAddress;
  const userId = req.user.id;

  if(!walletAddress || !userId){
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
      next(new RequestError(0, msg, 200));
      return;
    });
});

export { router };
