const mongo = require('mongoose');


const userSchema = new mongo.Schema({
first_name :{type:String,default:null},
last_name :{type:String,default:null},
email :{type:String,unique:true},
password :{type:String},
token:{type:String}
});

module.exports = mongo.model("user",userSchema);