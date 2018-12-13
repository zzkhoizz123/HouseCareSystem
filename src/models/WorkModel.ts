import * as Promise from "bluebird";
import { ObjectId } from "bson";

import { factory } from "config/LoggerConfig";
import * as Model from "models/Models";

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
      })
      .then((user) => {
        if (!user) {
          return reject("User not found");
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
        WorkModel.create(work)
          .then(newwork => {
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
      })
      .catch(err => {
        return reject("Error occured");
      })
    });
};

const ChooseWork = (userId, userRole, workId) => {
  return new Promise((resolve, reject) => {
    if (userRole !== 0) {
      return reject("You are not a worker");
    }
    WorkModel.findOneAndUpdate(
      { _id: new ObjectId(workId) },
      { $set: { helper: userId } }
    )
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
    .exec((err, work) => {
      if (err) {
        return reject("Error occur");
      }
        return resolve(work);
    });
  });
};

const GetWorkList = (userId, userRole, query) => {
  return new Promise((resolve, reject) => {
    let userQuery: object;
    if (userRole === 0) {
      userQuery = {helper: new ObjectId(userId)};
    }
    else {
      userQuery = {owner: new ObjectId(userId)};
    }
    WorkModel.find({
      $and: [
        userQuery,
        query
      ]
    }, (err, lst) => {
      if (err) {
        return reject("Error when updating database");
      }
      return resolve(lst);
    });
  });
};

const GetWorkingListOfUser = (userId, userRole) => {
  return GetWorkList(userId, userRole, {time: {$gt: Date.now()}});
};

export {
  CreateWork,
  GetWorkingListOfUser,
  ChooseWork,
  GetWorkList
};
