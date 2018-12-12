import express = require('express');
import * as OwnerModel from 'models/Owner';
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

    OwnerModel.GetOwnerByUsername(username)
        .then((owner) => { 
            var check = OwnerModel.ComparePassword(password, owner['password'])

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

    OwnerModel.FindByRegExUsername(username)
        .then((owner) => { return OwnerModel.FindByRegExEmail(email); })
        .then((owner) => {
            var newOwnerModel = new OwnerModel.Owner({
                name: name,
                email: email,
                username: username,
                password: password
            });
            OwnerModel.createOwner(newOwnerModel, function(err, owner) {
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

    OwnerModel.ResetPassword(name, pass, new_pass)
        .then((result) => {
            res.status(200);
            return res.json({message: '', success: true, error: 0, data: {}});
        })
        .catch((err) => {
            return res.json({message: err, success: false, error: 1, data: {}});
        });
});

router.post('/changejob/:id', (req, res) => {
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

    OwnerModel.ChangeJob(id, typeList, time, location, salary)
        .then((result) =>{
            return res.json({message: "", success: true, error: 0, data: {}})
        })
        .catch((err)=>{
            return res.json({message: err, success: false, error: 1, data: {}})
        })
});


router.get('/:id', function(req, res) {
    var id = req.params.id;

    OwnerModel.GetOwnerByID(id)
        .then((owner) => {
            res.status(200);
            return res.json(
                {message: "", success: true, error: 0, data: {owner}});
        })
        .catch(
            (error) => {return res.json(
                {message: error, success: false, error: 1, data: {}})})
        .catch(
            () => {return res.json(
                {message: 'Error', success: false, error: 1, data: {}})});
});

export {router};