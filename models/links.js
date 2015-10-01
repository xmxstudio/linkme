var mongoose = require('mongoose');

var linksSchema = new mongoose.Schema({title : String,  url : String , description: String, image : String , rating : Number,likes : Number, dislikes: Number, author : String ,  postdate : String ,  clicks : Number, tags : Array});
var Links = mongoose.model('Links', linksSchema);
module.exports = Links;


