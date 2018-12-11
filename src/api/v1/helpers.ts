import express = require('express');

import * as HelperModel from 'models/Helper';
import {factory} from 'config/LoggerConfig';

const router = express.Router();
const routeLog = factory.getLogger('request.Route');
const dbLog = factory.getLogger('database.Mongo');


router.post('/signup', function(req, res) {
    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;

    HelperModel.findByRegExUsername(username)
        .then((helper) => { return HelperModel.findByRegExEmail(email); })
        .then((helper) => {
            var newHelperModel = new HelperModel.Helper({
                name: name,
                email: email,
                username: username,
                password: password
            });
            HelperModel.createUser(newHelperModel, function(err, helper) {
                if (err) {
                    return res.json({success: false});
                }
            });
            // req.flash('success_msg', 'You are registered and can now
            // login');
            res.status(200);
            return res.json({success: true});
        })
        .catch(() => {
            return res.json({message: 'UserModelname or email existed'});
        });
});

router.get('/worklist/:name', function(req, res) {
    // var helpername = 'khoi9';
    var helpername = req.params.name;

    HelperModel.GetWorkByHelperName(helpername)
        .then((workingList) => { return res.json({data: workingList}); })
        .catch((error) => {return res.json({error: error})})
        .catch(() => {return res.json({error: 'Error'})});
});


router.post('/reset_password', (req, res) => {
    let name = req.body.username;
    let pass = req.body.password;
    let new_pass = req.body.new_password;

    if (!name || !pass || !new_pass) {
        res.json({err: 'no username or password'});
        res.end();
        return;
    }

    HelperModel.ResetPassword(name, pass, new_pass)
        .then((result) => {return res.json()})
        .catch((err) => {return res.json()})
});

export {router};
