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
                    return res.json(
                        {message: err, success: false, error: 1, data: {}});
                }
            });
            res.status(200);
            return res.json({message: "", success: true, error: 0, data: {}});
        })
        .catch(() => {
            return res.json({
                message: 'UserModelname or email existed',
                success: false,
                error: 1,
                data: {}
            });
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

router.get('/:id', function(req, res) {
    var id = req.params.id;

    HelperModel.GetHelperByID(id)
        .then((helper) => {
            res.status(200);
            return res.json(
                {message: "", success: true, error: 0, data: {helper}});
        })
        .catch(
            (error) => {return res.json(
                {message: error, success: false, error: 1, data: {}})})
        .catch(
            () => {return res.json(
                {message: 'Error', success: false, error: 1, data: {}})});
});

router.post('/reset_password', (req, res) => {
    let name = req.body.username;
    let pass = req.body.password;
    let new_pass = req.body.new_password;

    if (!name || !pass || !new_pass) {
        res.json({
            message: 'no username or password',
            success: false,
            error: 1,
            data: {}
        });
        res.end();
        return;
    }

    HelperModel.ResetPassword(name, pass, new_pass)
        .then((result) => {
            res.status(200);
            return res.json({message: '', success: true, error: 0, data: {}});
        })
        .catch((err) => {
            return res.json({message: err, success: false, error: 1, data: {}});
        });
});

export {router};
