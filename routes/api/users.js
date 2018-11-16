const express = require('express');
const router = express.Router();

const User = require('../../models/User');

/**
 * POST: /signup
 * 	@param name: User Register Name
 * 	@param email: User Register Email
 * 	@param username: Username on System
 * 	@param password: User's password
 */
router.post('/signup', function (req, res) {
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	console.log('{name: %s, email: %s, username: %s, password: %s}',
		name,
		email,
		username,
		password
	);

	User.findByRegExUsername(username)
		.then((user)=>{
			return User.findByRegExEmail(email);
		})
		.then((user) => {
			var newUser = new User({
				name: name,
				email: email,
				username: username,
				password: password
			});
			User.createUser(newUser, function (err, user) {
				if (err) { return res.json({success : false}); }
				console.log(user);
			});
			 //req.flash('success_msg', 'You are registered and can now login');
			return res.json({success: true});
		})
		.catch(()=>{
			return res.json({message: 'Username or email existed'})
		});

/*
	User.findOne({ username: {
			"$regex": "^" + username + "\\b", "$options": "i"
	}}, function (err, user) {
			if (err) {
				return;	
			}
			User.findOne({ email: { 
				"$regex": "^" + email + "\\b", "$options": "i"
		}}, function (err, mail) {
				if (err) {
					return;
				}
				if (user || mail) {
					res.json({message: "Has already name or email"});
				}
				else {
					var newUser = new User({
						name: name,
						email: email,
						username: username,
						password: password
					});
					User.createUser(newUser, function (err, user) {
						if (err) { res.json({success : false}); }
						console.log(user);
					});
         			//req.flash('success_msg', 'You are registered and can now login');
					res.json({success: true});
				}
			});
		});
	//}
	*/
});


router.post('/login',
	function (req, res) {
		var username = req.body.username;
		var password = req.body.password;
		User.getUserByUsername(username, function (err, user) {
			if (err) res.json({errors: err});
			if (!user) {
				res.json({ message: 'Unknown User' });
				return;
			}

			User.comparePassword(password, user.password, function (err, isMatch) {
				if (err) res.json({errors: err});
				if (isMatch) {
					res.json({success : true})
				} else {
					res.json({ message: 'Invalid password' });
				}
			});
		});
	});

module.exports = router;