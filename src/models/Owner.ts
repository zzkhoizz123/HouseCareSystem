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

const OwnerSchema = new Schema({
    username: {type: String, unique: true},
    password: {type: String},
    email: {type: String, unique: true},
    name: {type: String},
    sex: {type: String},
    character: CharacterSchema,
    job: JobSchema
});

var Owner = model('Owner', OwnerSchema);

var salt = "khoitran";

let ChangeJob = (id, typeList, time, salary, location )=>{
    return new Promise((resolve, reject)=>{
        Owner.updateOne(
                {_id: new ObjectId(id)}, 
                {$set: {job: {type: typeList, location: location, time: time, expectedSalary: salary}}},
                (err, result)=>{
                    if(err) return reject(err);
                    return resolve(result);
                });     
    });
}

let GetOwnerByID =
    (id) => {
       return new Promise((resolve, reject) => {
          Owner.findOne({_id: new ObjectId(id)}, (err, owner) => {
             if (err) return reject(err);
             if (owner) {
                return resolve(owner);
             } else
                return reject();
          });
       });
    }

let GetOwnerByUsername = (name) => {
    return new Promise((resolve, reject) => {
       Owner.findOne({username: name}, (err, owner) => {
          if (err) return reject(err);
          if (owner) {
            return resolve(owner);
          } else
            return reject();
       });
    });
 }

 var ComparePassword = (pass, hashpass)=>{
    let rightPassword: boolean = bcrypt.compareSync(pass, hashpass);
    return rightPassword;
 }

 let FindByRegExUsername = (name) => {
    return new Promise((resolve, reject) => {
       Owner.findOne(
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


 let FindByRegExEmail = (email) => {
    return new Promise((resolve, reject) => {
       Owner.findOne(
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

 let createOwner = function(newUser, callback) {
    newUser.password = bcrypt.hashSync(newUser.password);
    newUser.save(callback);
 };

    var HashPassword =
    (password) => {
       return bcrypt.hashSync(password)
    }

    let ResetPassword =
    (name, curpwd, newpwd) => {
       return new Promise((resolve, reject) => {
          Owner.findOne({username: name}, (err, owner) => {
             let rightPassword: boolean =
                 bcrypt.compareSync(curpwd, owner['password']);
             dbLog.info('password: ' + owner['password']);
             dbLog.info('right?: ' + rightPassword);
             if (!rightPassword) return reject("Wrong password");

             Owner.updateOne(
                 {username: new RegExp("^" + name + "\\b", 'i')},
                 {$set: {password: HashPassword(newpwd)}}, (err, result) => {
                    if (err) return reject(err);

                    dbLog.info("Ok: " + result);
                    return resolve(result);
                 });
          });
       });
    }

export {
    Owner,
    GetOwnerByUsername,
    ComparePassword,
    FindByRegExUsername,
    FindByRegExEmail,
    createOwner,
    ResetPassword,
    GetOwnerByID,
    ChangeJob
 }