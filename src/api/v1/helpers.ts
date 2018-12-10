import express = require('express');
const router = express.Router();
import * as HelperModel from '../../models/Helper';

//const Owner = require('../../models/Owner');

router.post('/signup', function(req, res) {
    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;

    console.log(
        '{name: %s, email: %s, username: %s, password: %s}', name, email,
        username, password);

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
                console.log(helper);
            });
            // req.flash('success_msg', 'You are registered and can now
            // login');
            return res.json({success: true});
        })
        .catch(() => {
            return res.json({message: 'UserModelname or email existed'});
        });
});

router.get('/worklist/:name', function (req, res) {
    //var helpername = 'khoi9';
    var helpername = req.params.name
	console.log('{name: %s}',helpername);

	HelperModel.GetWorkByHelperName(helpername)
		.then((workingList)=>{
			return res.json({data: workingList}); 
        })
        .catch((error)=>{
            return res.json({error: error})
        })
		.catch(()=>{
			return res.json({error: 'Error'})
		});
	});
	

router.post('/reset_password', (req, res)=>{
	let name = req.body.username;
    let pass = req.body.password;
	let new_pass = req.body.new_password;
	
	if (!name || !pass || !new_pass) {
		res.json({err: 'no username or password'});
		res.end();
		return;
	  }
	  
	HelperModel.ResetPassword(name, pass, new_pass)
		.then((result)=>{
			return res.json()
		})
		.catch((err)=>{
			return res.json()
		})
});

export {router};