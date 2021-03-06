import * as bcrypt from "bcryptjs";
import * as Promise from "bluebird";
import { ObjectId } from "bson";
import { model, Schema } from "mongoose";

import logger from "utils/logger";
import * as Model from "models/Models";

const salt = "5802ae89"; // md5('ohmygod')[:8]
const UserModel = Model.UserModel;

const CreateNewUser = (username, password, name, email, role, sex, address, DoB, experience, walletAddress) => {
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
          role, 
          sex,
          address,
          DoB,
          experience,
          walletAddress
        });
        UserModel.create(user)
          .then(user2=>{
            UserModel.findById(user2._id)
              .select("-password -__v")
              .exec((err2, res) => {
                if (err2) {
                  return reject("Error occur");
                }
                return resolve(res);
              });
          })
      }
    );
  });
};

const VerifyUser = (username, password) => {
  return new Promise((resolve, reject) => {
    UserModel.findOne({ username }, (err, user) => {
      if (user) {
        if (bcrypt.compareSync(password, user.password)) {
          resolve({
            role: user.role,
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email
          });
        } else {
          reject("Wrong credential");
        }
      } else {
        reject("Wrong credential");
      }
    });
  });
};

const GetUserByID = id => {
  return new Promise((resolve, reject) => {
    UserModel.findOne({ _id: new ObjectId(id) })
      .select("-password -__v")
      .exec((err, res) => {
        if (err) {
          return reject("Error occur");
        }
        return resolve(res);
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
      if(err){
        return reject("Wrong username");
      }
      
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
            return reject("Error occur");
          }

          logger.info("Ok: " + result);
          return resolve(result);
        }
      );
    });
  });
};

const AddWalletAddress = (userId, walletAddress) =>{
  return new Promise((resolve, reject) => {
    UserModel.findOneAndUpdate(
      {_id: new ObjectId(userId)},
      {$set: {walletAddress}}
    )
    .select("-password -__v")
    .exec((err, user) => {
      if (err) {
        return reject("Error occur");
      }
      return resolve(user);
    });
  });
}

export {
  CreateNewUser,
  VerifyUser,
  ResetPassword,
  GetUserByID,
  GetUserByUsername,
  AddWalletAddress
};
