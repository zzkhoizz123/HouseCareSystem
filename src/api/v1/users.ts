import express = require('express');
import * as UserModel from 'models/User';

const router = express.Router();

router.get('/', function(req, res) { console.log('home route'); });

/**
 * POST: /signup
 *     @param name: UserModel Register Name
 *     @param email: UserModel Register Email
 *     @param username: UserModelname on System
 *     @param password: UserModel's password
 */
router.post('/signup', function(req, res) {
    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;

    UserModel.findByRegExUsername(username)
        .then((user) => { return UserModel.findByRegExEmail(email); })
        .then((user) => {
            var newUserModel = new UserModel.User({
                name: name,
                email: email,
                username: username,
                password: password
            });
            UserModel.createUser(newUserModel, function(err, user) {
                if (err) {
                    return res.json({success: false});
                }
            });
            return res.json({success: true});
        })
        .catch(() => {
            return res.json({message: 'UserModelname or email existed'});
        });
});


router.post('/login', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    UserModel.getUserByUsername(username, function(err, user) {
        if (err) res.json({errors: err});
        if (!user) {
            res.json({message: 'Unknown UserModel'});
            return;
        }

        UserModel.comparePassword(
            password, user.password, function(err, isMatch) {
                if (err) res.json({errors: err});
                if (isMatch) {
                    res.json({success: true});
                } else {
                    res.json({message: 'Invalid password'});
                }
            });
    });
});

export {router};
