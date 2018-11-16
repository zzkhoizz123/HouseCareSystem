var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');

// User Schema
const UserSchema = new Schema({
	username: {
		type: String,
        index: true,
        unique: true 
	},
	password: {
		type: String
	},
	email: {
        type: String,
        unique : true
	},
	name: {
		type: String
	}
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
}

module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}

module.exports.findByRegExUsername = (name) => {
	return new Promise((resolve, reject) => {
		User.findOne({ username: new RegExp("^" + name + "\\b", 'i') }, (err, user)=> {
			if (err)
				return reject(err);
			if (user)
				return reject();
			else
				return resolve(user);
		});
	});
}

module.exports.findByRegExEmail = (email) => {
	return new Promise((resolve, reject) => {
		User.findOne({ email: new RegExp("^" + email + "\\b", 'i') },(err, user)=> {
			if (err)
				return reject(err);
			if (user)
				return reject();
			else
				return resolve(user);
		});
	});
}