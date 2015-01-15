var Mongoose = require('mongoose');
var Hash = require('password-hash');
var Schema = Mongoose.Schema;

var UserSchema = new Schema({
	
	user_id: { type: String, index: true},
	
	email: { type: String,index:  { sparse: true }},

	strategy : {type: String},

	local_password: { type: String, set: function(newValue) {
		return Hash.isHashed(newValue) ? newValue : Hash.generate(newValue);
	} },

	first_name : { type: String},
	
	last_name : { type: String},
	
	guardians : [
			{ 
				email : String,
				user_id: String,
				account_registered : Boolean
			}
		],

	prefers_email : {type:Boolean},

	cell : {type:String},

	prefers_cell : {type:Boolean},

	wards: [
		{
			name: String,
			magic_number: String,
			date_of_birth : Date
		}
	],

	profile_created: {type: Boolean},

	account_creation_date: { type: Date}

});

UserSchema.statics.local_authenticate = function(email, local_password, callback) {
	this.findOne({ user_id: email }, function(error, user) {
		if (user && Hash.verify(local_password, user.local_password)) {
			callback(null, user);
		} else if (user || !error) {
			// Email or password was invalid (no MongoDB error)
			callback({message:"Your email address or password is invalid. Please try again."}, null);
		} else {
			// Something bad happened with MongoDB. You shouldn't run into this often.
			callback({message:"Internal server error"}, null);
		}
	});
};

UserSchema.statics.findById = function(user_id,callback) {
	this.findOne({user_id:user_id}, function(error,user){
		if (user) {
			callback(null,user,false);
		}
		else {
			callback(new Error('User not found'),null,true);
		}
	});
};

UserSchema.statics.findWardByMagicNumber = function(guardian_email,magic_number,callback) {
	this.findOne({'email':guardian_email},{wards:{$elemMatch:{magic_number:magic_number}}}, function(error,user){
		if (user) {
			callback(null,user);
		}
		else {
			callback(new Error('User not found'),null);
		}
	});
};

UserSchema.statics.findGuardianByWardId = function(ward_id,callback) {
	this.findOne({'wards._id':ward_id}, function(error,user){
		if (user) {
			callback(null,user);
		}
		else {
			callback(new Error('User not found'),null);
		}
	});
};

var User = Mongoose.model('User', UserSchema);

module.exports = {
	User : User
}