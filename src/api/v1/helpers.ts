import express = require('express');

import * as HelperModel from 'models/Helper';
import {factory} from 'config/LoggerConfig';

const router = express.Router();
const routeLog = factory.getLogger('request.Route');
const dbLog = factory.getLogger('database.Mongo');

router.post('/signin', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;

    if (!username || !password){
        res.json({
            message: 'no username or password',
            success: false,
            error: 1,
            data: {}
        });
        return;
    }

    HelperModel.GetHelperByUsername(username)
        .then((helper) => { 
            var check = HelperModel.ComparePassword(password, helper['password'])
            if (check == true){
                return res.json({
                    message: "",
                    success: true,
                    error: 0,
                    data: {}
                });
            }
            else{
                return res.json({
                    message: "Wrong password",
                    success: false,
                    error: 1,
                    data: {}
                });
            }   
        })
        .catch((err) => {
            return res.json({
                message: err,
                success: false,
                error: 1,
                data: {}
            });
        })
        .catch(() => {
            return res.json({
                message: 'Wrong username',
                success: false,
                error: 1,
                data: {}
            });
        })
});


router.post('/signup', function(req, res) {
    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;

    if (!email || !username || !password){
        res.json({
            message: 'no username or password or email',
            success: false,
            error: 1,
            data: {}
        });
        return;
    }

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
            return res.json({message: "", success: true, error: 0, data: {}});
        })
        .catch((err) => {
            return res.json({
                message: err,
                success: false,
                error: 1,
                data: {}
            });
        })
        .catch(() => {
            return res.json({
                message: 'UserModel name or email existed',
                success: false,
                error: 1,
                data: {}
            });
        })      
});

router.get('/jobs/:id', function(req, res) {
    var id = req.params.id;

    HelperModel.GetJobByHelperID(id)
        .then((workingList) => { return res.json({
            message: '',
            success: true,
            error: 0,
            data: {workingList}
            }); 
        })
        .catch((error) => {return res.json({
            message: error,
            success: false,
            error: 1,
            data: {}
        })})
        .catch(() => {return res.json({
            message: 'Error',
            success: false,
            error: 1,
            data: {}
        })});
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

router.post('/addjob/:id', (req, res) => {
    let id = req.params.id
    let typeList = req.body.type;
    let time = req.body.time;
    let location = req.body.location;
    let salary = req.body.salary;

    if (!id || !typeList || !time || !salary || !location) {
        res.json({
            message: 'Wrong input',
            success: false,
            error: 1,
            data: {}
        });
        res.end();
        return;
    }  

    HelperModel.AddJob(id, typeList, time, location, salary)
        .then((result) =>{
            return res.json({message: "", success: true, error: 0, data: {}})
        })
        .catch((err)=>{
            return res.json({message: err, success: false, error: 1, data: {}})
        })
});

export {router};
