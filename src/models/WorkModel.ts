import * as bcrypt from "bcryptjs";
import * as Promise from "bluebird";
import { ObjectId } from "bson";
import { model, Schema } from "mongoose";

import { factory } from "config/LoggerConfig";
import * as Model from "models/Models";
import { Work } from "./Work";

const dbLog = factory.getLogger("database.Mongo");
const routeLog = factory.getLogger("request.Route");
const UserModel = Model.UserModel;
const WorkModel = Model.WorkModel;


const CreateWork = (userId, typeList, newtime, newsalary, newlocation, newdescription) => {
    return new Promise((resolve, reject) => {
        UserModel.findOne({
            $or: [{ id: userId }, { role: 1 }]
        }, (err, user) => {
            if (err) {
                return reject("Error occur");
            }
            if (user) {
                const work = new WorkModel({
                    type: typeList,
                    description: newdescription,
                    status: 0,
                    location: newlocation,
                    time: newtime,
                    expectedSalary: newsalary,
                    owner: user._id
                });
                WorkModel.create(work)
                    .then((newwork) => {
                        UserModel.update(
                            { _id: user._id },
                            { $push: { workingList: newwork._id } }
                        );
                        WorkModel.findById(newwork._id)
                            .populate({ path: "owner", select: "-password -__v", model: "User" })
                            .exec((err1, res) => {
                                if (err1) {
                                    return reject(err1);
                                }
                                return resolve(res);
                            })
                    });
            }
        });
    });
}



const GetWorkingListOfUser =
    (userId) => {
        return new Promise((resolve, reject) => {
            UserModel.findOne(
                { id: new ObjectId(userId) },
                (err, user) => {
                    if (err) {
                        return reject("Error occur");
                    }
                    if (user) {
                        return resolve(user.workingList);
                    }
                    else {
                        return reject("Can't find user");
                    }
                });
        });
    }

export { CreateWork, GetWorkingListOfUser }
