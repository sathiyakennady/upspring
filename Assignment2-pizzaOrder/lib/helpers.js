/*
*
Dependencies
*
*/
var crypto = require('crypto');
var config=require('./config');
//Instantiate Helpers module
var helpers = {};

//parse string/object to JSON object
helpers.parseJSONToObject = function(str){
    try{
        var obj = JSON.parse(str);
        return obj;
    }catch(e){
        return {};
    }
}

helpers.hash = function(password){
    var hashedPassword = crypto.createHmac('sha256', config.hashingSecret).update(password).digest('hex');
    return hashedPassword;
}

helpers.generateToken = function(){
    var token = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 20; i++)
    token += possible.charAt(Math.floor(Math.random() * possible.length));

    return token;
}

helpers.emailValidator = function(email){
    if(/\S+@\S+\.\S+/.test(email)){
        return true;
    }else{
        return false;
    }
}

//Export helpers module
module.exports = helpers;