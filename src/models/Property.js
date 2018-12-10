var mongoose = require('mongoose');
var Schema = mongoose.Schema;

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

var Property = module.exports = mongoose.model('Property', PropertySchema);