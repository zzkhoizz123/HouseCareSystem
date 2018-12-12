import * as bcrypt from "bcryptjs";
import * as Promise from "bluebird";
import { ObjectId } from "bson";
import { model, Schema } from "mongoose";

import { factory } from "config/LoggerConfig";
import * as Model from "models/Models";

const dbLog = factory.getLogger("database.Mongo");
const routeLog = factory.getLogger("request.Route");
const salt = "5802ae89"; // md5('ohmygod')[:8]
const UserModel = Model.UserModel;

const CreateNewUser = (username, password, name, email, role) => {
  return new Promise((resolve, reject) => {
    UserModel.findOne(
      {
        $or: [{ username }, { email }]
      },
      (err, tryfind) => {
        if (tryfind) {
          return reject("Username or Email existed");
        }
        password = bcrypt.hashSync(password);
        const user = new UserModel({
          username,
          password,
          name,
          email,
          role
        });
        user.save();
        return resolve("Signup Success");
      }
    );
  });
};

const VerifyUser = (username, password) => {
  return new Promise((resolve, reject) => {
    password = bcrypt.hashSync(password);
    UserModel.findOne(
      {
        $and: [{ username }, { password }]
      },
      (err, user) => {
        if (user) {
          const jwt = "random jwt";
          resolve({ jwt, role: user.role });
        } else {
          reject("Wrong credential");
        }
      }
    );
  });
};

const GetUserByID = id => {
  return new Promise((resolve, reject) => {
    UserModel.findOne({ id: new ObjectId(id) }, (err, helper) => {
      if (err) {
        return reject("Error occured");
      }
      if (helper) {
        return resolve(helper);
      } else {
        return reject("No user found");
      }
    });
  });
};

const GetUserByUsername = name => {
  return new Promise((resolve, reject) => {
    UserModel.findOne({ username: name }, (err, helper) => {
      if (err) {
        return reject("Error occured");
      }
      if (helper) {
        return resolve(helper);
      } else {
        return reject("No user found");
      }
    });
  });
};

const GetUserByEmail = email => {
  return new Promise((resolve, reject) => {
    UserModel.findOne({ email }, (err, user) => {
      if (err) {
        return reject(err);
      }
      if (user) {
        return reject();
      } else {
        return resolve(user);
      }
    });
  });
};

const HashPassword = password => {
  return bcrypt.hashSync(password);
};

const ComparePassword = (pass, hashpass) => {
  const rightPassword: boolean = bcrypt.compareSync(pass, hashpass);
  return rightPassword;
};

const ResetPassword = (name, curpwd, newpwd) => {
  return new Promise((resolve, reject) => {
    UserModel.findOne({ username: name }, (err, helper) => {
      const rightPassword: boolean = bcrypt.compareSync(
        curpwd,
        helper.password
      );

      if (!rightPassword) {
        return reject("Wrong password");
      }

      UserModel.updateOne(
        { username: new RegExp("^" + name + "\\b", "i") },
        { $set: { password: HashPassword(newpwd) } },
        (err1, result) => {
          if (err1) {
            return reject(err1);
          }

          dbLog.info("Ok: " + result);
          return resolve(result);
        }
      );
    });
  });
};

export {
  CreateNewUser,
  VerifyUser,
  ResetPassword,
  GetUserByID,
  GetUserByUsername
};