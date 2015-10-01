var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({joined: String,email: String,password: String,user: String,social: String,verified: String});
var User = mongoose.model('User', userSchema);
module.exports = User;


