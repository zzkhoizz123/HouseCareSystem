import * as Promise from "bluebird";
import { ObjectId } from "bson";

import logger from "utils/logger";
import * as Model from "models/Models";
import * as moment from "moment";

const UserModel = Model.UserModel;
const WorkModel = Model.WorkModel;

const CreateWork = (
  userId,
  typeList,
  newtime,
  newtimespan,
  newsalary,
  newlocation,
  newdescription
) => {
  return new Promise((resolve, reject) => {
    UserModel.findOne({
      $and: [{ _id: userId }, { role: 1 }]
    })
      .then(user => {
        if (!user) {
          return reject("User not found");
        }
        const work = new WorkModel({
          type: typeList,
          description: newdescription,
          timespan: newtimespan,
          status: 0,
          location: newlocation,
          time: newtime,
          expectedSalary: newsalary,
          owner: user._id,
          helper: null,
          contractAddress: null
        });

        WorkModel.create(work).then(newwork => {
          UserModel.update(
            { _id: user._id },
            { $push: { workingList: newwork._id } }
          );
          WorkModel.findById(newwork._id)
            .select("-__v")
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
      });
  });
};

const ChooseWork = (userId, userRole, workId) => {
  return new Promise((resolve, reject) => {
    if (userRole !== 0) {
      return reject("You are not a worker");
    }
    WorkModel.findOneAndUpdate(
      { _id: new ObjectId(workId) },
      { $set: { helper: new ObjectId(userId) } }
    )
      .select("-__v")
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

const GetWorkList = query => {
  return new Promise((resolve, reject) => {
    WorkModel.find(query)
      .select("-__v")
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
      .then(lst => {
        return resolve(lst);
      })
      .catch(err => {
        return reject(err);
      });
  });
};

const GetWorkingListOfUser = (userId, userRole) => {
  let userQuery: object;
  if (userRole === 0) {
    userQuery = { helper: new ObjectId(userId) };
  } else {
    userQuery = { owner: new ObjectId(userId) };
  }
  return GetWorkList({ $and: [userQuery, { time: { $gt: Date.now() } }] });
};

const GetWorkingListToday = (userId, userRole) => {
  let userQuery: object;
  if (userRole === 0) {
    userQuery = { helper: new ObjectId(userId) };
  } else {
    userQuery = { owner: new ObjectId(userId) };
  }

  const today =new Date(moment().format("YYYY-MM-DD"));
  const tomorow = new Date(moment().add(1, "days").format("YYYY-MM-DD"));
  
  return GetWorkList({
    $and: [
      userQuery,
      {
        time: {$lte: tomorow}
      },
      {
        time : {$gte: today}
      }

    ]
  });
};

const AddContractAddress = (workId, contractAddress) => {
  return new Promise((resolve, reject) => {
    WorkModel.findOneAndUpdate(
      { _id: new ObjectId(workId) },
      { $set: { contractAddress } },
      { new: true } // returns new data for front-end to update
    )
      .select("-__v")
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

export {
  CreateWork,
  GetWorkingListOfUser,
  ChooseWork,
  GetWorkList,
  GetWorkingListToday,
  AddContractAddress
};
