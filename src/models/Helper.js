var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');
//const toJsonSchema = require('to-json-schema');

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

const ProfileSchema = new Schema({
	picture: {
		type: String
    },
    experience: {
        type: String
    },
    level: {
        type: String
    },
    introducedBy:{
        type: String
    },
    previousJob:{
        type: String
    }
});

const HelperSchema = new Schema({
	username: {
		type: String,
        unique: true 
	},
	password: {
		type: String
	},
	email: {
        type: String,
        //unique : true
	},
	name: {
		type: String
    },  
    sex:{
        type: String
    },
    property: PropertySchema,
    profile: ProfileSchema,
    workingList: [WorkSchema]
});

var Helper = module.exports = mongoose.model('Helper', HelperSchema);

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