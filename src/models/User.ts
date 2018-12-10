import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import * as Promise from 'bluebird';
// User Schema
var Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {type: String, index: true, unique: true},
    password: {type: String},
    email: {type: String, unique: true},
    name: {type: String}
});

var User = mongoose.model('User', UserSchema);

let createUser = function(newUser, callback) {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
};

let getUserByUsername = function(username, callback) {
    var query = {username: username};
    User.findOne(query, callback);
};

let getUserById = function(id, callback) {
    User.findById(id, callback);
};

let comparePassword = function(candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        if (err) throw err;
        callback(null, isMatch);
    });
};

let findByRegExUsername = (name) => {
    return new Promise((resolve, reject) => {
        User.findOne(
            {username: new RegExp('^' + name + '\\b', 'i')}, (err, user) => {
                if (err) return reject(err);
                if (user)
                    return reject();
                else
                    return resolve(user);
            });
    });
};

let findByRegExEmail = (email) => {
    return new Promise((resolve, reject) => {
        User.findOne(
            {email: new RegExp('^' + email + '\\b', 'i')}, (err, user) => {
                if (err) return reject(err);
                if (user)
                    return reject();
                else
                    return resolve(user);
            });
    });
};

export {
    User,
    findByRegExUsername,
    findByRegExEmail,
    getUserById,
    getUserByUsername,
    comparePassword,
    createUser
}
