var helpers={}

// Return the response in JSON format
helpers.getStatus=function(){
	return {'Success' : 'Welcome to NodeJs. Hope you like my First assignment!'};
};

// Return the response in JSON format when query string parameter is passed.
helpers.getNameStatus=function(str){
	var welcomeMsg="Welcome to NodeJs " + str + ". Have a good day!";
	return {'Success' : welcomeMsg };
};
helpers.getWelcomePage=function()
{
    return {'success':'Welcome to NodeJs Page'}
}

module.exports=helpers