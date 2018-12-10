var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');

const WorkSchema = new Schema({
	type: {
		type: String,
	},
	description: {
		type: String
	},
	location: {
		type: String,
	},
	time: {
        type: Date, // String to date
        default: Date.now
    },  
    expectedSalary:{
        type: String
    }
});

const CharacterSchema = new Schema({
	type: {
		type: String,
	},
	description: {
		type: String
	}
});

const PropertySchema = new Schema({
	location: {
        type: String,
    },
    character: CharacterSchema,
    work: WorkSchema
});

const OwnerSchema = new Schema({
	username: {
		type: String,
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
    },  
    sex:{
        type: String
    },
    property: PropertySchema
});

var Owner = module.exports = mongoose.model('Owner', OwnerSchema);

module.exports.GetWorkByHelperName = (helpername) => {
	return new Promise((resolve, reject) => {
		Helper.findOne({ username: new RegExp("^" + helpername + "\\b", 'i') }, (err, helper)=> {
			if (err)
				return reject(err);
			if (helper){
                console.log(helper)
                //console.log(helper.workingList)
                return resolve(helper.workingList);
            }
			else
				return reject();
		});
	});
}