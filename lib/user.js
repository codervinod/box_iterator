var Mongoose = require('mongoose');
var Schema = Mongoose.Schema;

var UserSchema = new Schema({
	user_id: { type: String, index: true},
	name: {type: String},
	login: {type: String},
	accessToken:{type: String},
	refreshToken:{type: String}
});

var User = Mongoose.model('User', UserSchema);

module.exports = {
	User : User
}