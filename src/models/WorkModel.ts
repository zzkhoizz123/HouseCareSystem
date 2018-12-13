import * as bcrypt from "bcryptjs";
import * as Promise from "bluebird";
import { ObjectId } from "bson";
import { model, Schema } from "mongoose";

import { factory } from "config/LoggerConfig";
import * as Model from "models/Models";
import { Work } from "./Work";
import { help } from "typescript-logging";

const dbLog = factory.getLogger("database.Mongo");
const routeLog = factory.getLogger("request.Route");
const UserModel = Model.UserModel;
const WorkModel = Model.WorkModel;

const CreateWork = (
  userId,
  typeList,
  newtime,
  newsalary,
  newlocation,
  newdescription
) => {
  return new Promise((resolve, reject) => {
    UserModel.findOne(
      {
        $and: [{ _id: userId }, { role: 1 }]
      },
      (err, user) => {
        if (err) {
          return reject("Error occur");
        }
        if (!user) {
          return reject("No user found");
        }
        const work = new WorkModel({
          type: typeList,
          description: newdescription,
          status: 0,
          location: newlocation,
          time: newtime,
          expectedSalary: newsalary,
          owner: user._id,
          helper: null
        });
        WorkModel.create(work).then(newwork => {
          UserModel.update(
            { _id: user._id },
            { $push: { workingList: newwork._id } }
          );
          WorkModel.findById(newwork._id)
            .populate({
              path: "owner",
              select: "-password -__v -role",
              model: "User"
            })
            .exec((err1, res) => {
              if (err1) {
                return reject(err1);
              }
              return resolve(res);
            });
        });
      }
    );
  });
};

const ChooseWork = (userId, workId) => {
  return new Promise((resolve, reject) => {
    UserModel.findById(userId, (err, user) => {
      if (err) {
        return reject("Error occur");
      }
      if (!user) {
        return reject("No user found");
      }
      if (user.role !== 0) {
        return reject("You are not a worker");
      }
      WorkModel.updateOne(
        { _id: new ObjectId(workId) },
        { $set: { helper: user._id } },
        (err2, raw) => {
          if (err2) {
            reject("Error in update database");
          }
          WorkModel.findById(workId)
            .populate({
              path: "owner",
              select: "-password -__v -role",
              model: "User"
            })
            .populate({
              path: "helper",
              select: "-password -__v -role",
              model: "User"
            })
            .exec((err1, work) => {
              if (err1) {
                return reject("Error occur");
              }
              return resolve(work);
            });
        }
      );
    });
  });
};

const GetWorkingListOfUser = userId => {
  return new Promise((resolve, reject) => {
    UserModel.findById(userId, (err, user) => {
      if (err) {
        return reject("Error occur");
      }
      if (!user) {
        return reject("No user found");
      }
      if (user.role === 0) {
        WorkModel.find(
          {
            $and: [
              { helper: new ObjectId(userId) },
              { time: { $gt: Date.now() } }
            ]
          },
          (err1, lst) => {
            if (err1) {
              return reject(err1);
            }
            return resolve(lst);
          }
        );
      } else {
        WorkModel.find(
          {
            $and: [
              { owner: new ObjectId(userId) },
              { time: { $gt: Date.now() } }
            ]
          },
          (err1, lst) => {
            if (err1) {
              return reject("Error in find");
            }
            return resolve(lst);
          }
        );
      }
    });
  });
};

export { CreateWork, GetWorkingListOfUser, ChooseWork };
