import {Schema, model} from 'mongoose';
import * as bcrypt from 'bcryptjs';
import {ObjectId} from 'bson';
import * as Promise from 'bluebird';

import {factory} from 'config/LoggerConfig';

const dbLog = factory.getLogger("database.Mongo");
const routeLog = factory.getLogger("request.Route");

const WorkSchema = new Schema({
   type: {
      type: String,
   },
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
   type: {
      type: String,
   },
   description: {type: String}
});

const PropertySchema = new Schema({
   location: {
      type: String,
   },
   character: CharacterSchema,
   work: WorkSchema
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
      // unique : true
   },
   name: {type: String},
   sex: {type: String},
   property: PropertySchema,
   profile: ProfileSchema,
   workingList: [WorkSchema]
});

var Helper = model('Helper', HelperSchema);

var salt = "khoitran";

let findByRegExUsername = (name) => {
   return new Promise((resolve, reject) => {
      Helper.findOne(
          {username: name }, (err, user) => {
             if (err) return reject(err);
             if (user){
               console.log("hi3")
               return reject();
             }
             else{
               console.log("hi4")
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
               console.log("hi")
               return reject();
             }
             else{
               console.log("hi2")
                return resolve(user);
             }
          });
   });
};


let GetWorkByHelperName =
    (helpername) => {
       return new Promise((resolve, reject) => {
          Helper.findOne(
              {username: new RegExp("^" + helpername + "\\b", 'i')},
              (err, helper) => {
                 if (err) return reject(err);
                 if (helper) {
                    // console.log(helper.workingList)
                    return resolve(helper['workingList']);
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
                console.log(helper)
                    // console.log(helper.workingList)
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
   console.log(newUser.password)
   newUser.save(callback);
};

export {
   GetWorkByHelperName,
   ResetPassword,
   findByRegExEmail,
   findByRegExUsername,
   Helper,
   createUser,
   GetHelperByID
}
