import {Schema, model} from 'mongoose';
import * as bcrypt from 'bcryptjs';
import {ObjectId} from 'bson';
import * as Promise from 'bluebird';

import {factory} from 'config/LoggerConfig';

const dbLog = factory.getLogger("database.Mongo");
const routeLog = factory.getLogger("request.Route");

const JobSchema = new Schema({
   type: [{
      type: String,
   }],
   description: {type: String},
   location: {
      type: String,
   },
   time: {
      type: Date,  // String to date
      default: Date.now
   },
   expectedSalary: {type: String}
});

const CharacterSchema = new Schema({
   type: [{
      type: String,
   }],
   description: {type: String}
});

const ProfileSchema = new Schema({
   picture: {type: String},
   experience: {type: String},
   level: {type: String},
   introducedBy: {type: String},
   previousJob: {type: String}
});

const HelperSchema = new Schema({
   username: {type: String, unique: true},
   password: {type: String},
   email: {
      type: String,
      unique : true
   },
   name: {type: String},
   sex: {type: String},
   character: CharacterSchema,
   job: JobSchema,
   profile: ProfileSchema,
   jobList: [JobSchema]
});

var Helper = model('Helper', HelperSchema);

var salt = "khoitran";

let AddJob = (id, typeList, time, salary, location )=>{
   return new Promise((resolve, reject)=>{
       Helper.updateOne(
               {_id: new ObjectId(id)}, 
               {$set: {job: {type: typeList, location: location, time: time, expectedSalary: salary}}},
               (err, result)=>{
                   if(err) return reject(err);
                   return resolve(result);
               });     
   });
}


let findByRegExUsername = (name) => {
   return new Promise((resolve, reject) => {
      Helper.findOne(
          {username: name }, (err, user) => {
             if (err) return reject(err);
             if (user){
               return reject();
             }
             else{
               return resolve(user);
             }
          });
   });
};

let findByRegExEmail = (email) => {
   return new Promise((resolve, reject) => {
      Helper.findOne(
          {email:  email }, (err, user) => {
             if (err) return reject(err);
             if (user){
               return reject();
             }
             else{
                return resolve(user);
             }
          });
   });
};


let GetJobByHelperID =
    (id) => {
       return new Promise((resolve, reject) => {
          Helper.findOne(
              {_id: new ObjectId(id)},
              (err, helper) => {
                 if (err) return reject(err);
                 if (helper) {
                    // console.log(helper.workingList)
                    return resolve(helper['jobList']);
                 } else
                    return reject();
              });
       });
    }

let GetHelperByID =
    (id) => {
       return new Promise((resolve, reject) => {
          Helper.findOne({_id: new ObjectId(id)}, (err, helper) => {
             if (err) return reject(err);
             if (helper) {
                    // console.log(helper.workingList)
                    return resolve(helper);
             } else
                return reject();
          });
       });
    }

    let GetHelperByUsername = (name) => {
       return new Promise((resolve, reject) => {
          Helper.findOne({username: name}, (err, helper) => {
             if (err) return reject(err);
             if (helper) {
               return resolve(helper);
             } else
               return reject();
          });
       });
    }


var HashPassword =
    (password) => {
       return bcrypt.hashSync(password)
    }

var ComparePassword = (pass, hashpass)=>{
   let rightPassword: boolean = bcrypt.compareSync(pass, hashpass);
   return rightPassword;
}

let ResetPassword =
    (name, curpwd, newpwd) => {
       return new Promise((resolve, reject) => {
          Helper.findOne({username: name}, (err, helper) => {
             let rightPassword: boolean =
                 bcrypt.compareSync(curpwd, helper['password']);
             dbLog.info('password: ' + helper['password']);
             dbLog.info('right?: ' + rightPassword);
             if (!rightPassword) return reject("Wrong password");

             Helper.updateOne(
                 {username: new RegExp("^" + name + "\\b", 'i')},
                 {$set: {password: HashPassword(newpwd)}}, (err, result) => {
                    if (err) return reject(err);

                    dbLog.info("Ok: " + result);
                    return resolve(result);
                 });
          });
       });
    }

let createUser = function(newUser, callback) {
   newUser.password = bcrypt.hashSync(newUser.password);
   newUser.save(callback);
};

export {
   GetJobByHelperID,
   ResetPassword,
   findByRegExEmail,
   findByRegExUsername,
   Helper,
   createUser,
   GetHelperByID,
   GetHelperByUsername,
   ComparePassword,
   AddJob
}
