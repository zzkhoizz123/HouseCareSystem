const express = require('express');
const router = express.Router();

//const Owner = require('../../models/Owner');
const Helper = require('../../models/Helper');

router.get('/worklist', function (req, res) {
    var helpername = 'khoi9';
    
	console.log('{name: %s}',
		helpername
	);

	Helper.GetWorkByHelperName(helpername)
		.then((workingList)=>{
			return res.json({worklist: workingList}); 
        })
        .catch((error)=>{
            return res.json({message: error})
        })
		.catch(()=>{
			return res.json({message: 'Error'})
		});
    });

module.exports = router;