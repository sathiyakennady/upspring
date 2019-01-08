var helpers=require('./helpers');

// Defining handlers
var handlers = {};

// hello handler , returns the callback based on the querystring object is
// present or not.

handlers.hello = function(data,callback){
	
	var isQsParamPresent=(typeof(data.qsParam.name) == 'string' 
		&& data.qsParam.name.trim().length > 0 ) ? true : false; 
	console.log(isQsParamPresent);
	if(isQsParamPresent){
	    callback(200,helpers.getNameStatus(data.qsParam.name));
	}else{
		callback(200,helpers.getStatus());
	}

};

handlers.index=function(data,callback)
{
    callback(200,helpers.getWelcomePage())

}



// Not found handler
handlers.notFound = function(data,callback){
  callback(404,{'Status' : 'Sorry ! Url requested is not found' });
};

module.exports=handlers