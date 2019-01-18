var config = require('./config');
var helpers=require('./helpers');
var _data = require('./data');
var menus=require('./menus');
var stripe=require('./stripe');

var handlers={};

handlers.notFound = function(data, callback){
    callback(404);
}


handlers.users=function(data,callback)
{
    var acceptableMethods=['post','get','put','delete'];
    if(acceptableMethods.indexOf(data.method) > -1){
        handlers._users[data.method](data,callback);
      } else {
        callback(405);
      }
}

handlers._users={};

handlers._users.post=function(data,callback)
{
    console.log(data);
    var name = typeof(data.payload.name) == 'string' && data.payload.name.trim().length > 0 ? data.payload.name.trim() : false;
    var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    var email = typeof(data.payload.email) == 'string' && data.payload.email.trim().length >0? data.payload.email.trim() : false;
    var address = typeof(data.payload.address) == 'string' && data.payload.address.trim().length > 0 ? data.payload.address.trim() : false;
    
    console.log(name);
    console.log(password);
    console.log(email);
    console.log(address);

    if(name && password && email && address)
    {

        _data.read('users',name,function(err,data){

            if(err)
            {
                var hashedPassword = helpers.hash(password);
  
                if(hashedPassword)
                {
                    var userObject={
                        'name':name,
                        'password':hashedPassword,
                        'email':email,
                        'address':address
                    };

                    _data.create('users',email,userObject,function(err)
                    {

                        if(!err)
                        {
                            callback(200,{'Success':'Users created successfully'});
                        }
                        else{callback(500,{'error':'could not crerate new user',err})}
                    });
                }
                else{
                    callback(500,{'Error':'could not callback the user'})
                }
            }
            else{callback(400,{'error':'A user with that email id already exists'})}
        });
    }
    else{

        callback(400,{'Error':'Missing required field'})
    }
  
}




handlers._users.get=function(data,callback)
{
    var email=typeof(data.queryStringObject.email)=='string' && data.queryStringObject.email.trim().length > 0 ? data.queryStringObject.email.trim() : false;
    if(email)
    {
        var token=typeof(data.headers.token) =='string' ? data.headers.token : false;
        console.log(token);
        handlers._tokens.verifyToken(token,email,function(tokenIsValid)
        {
            if(tokenIsValid)
            {

                _data.read('users',email,function(err,data){
                    if(!err && data){
                      // Remove the hashed password from the user user object before returning it to the requester
                      delete data.password;
                      callback(200,data);
                    } else {
                      callback(404);
                    }
                  });
            }
            else{
                callback(403,{'error':'Missing token'})
            }


        });

    }
    else{
        callback(400,{'Error':'Missing Email field'});
    }

}



handlers._users.put=function(data,callback)
{

    var email=typeof(data.payload.email)=='string' && data.payload.email.trim().length>0? data.payload.email.trim() : false
    
 
    var name = typeof(data.payload.name) == 'string' && data.payload.name.trim().length > 0 ? data.payload.name.trim() : false;
    var address = typeof(data.payload.address) == 'string' && data.payload.address.trim().length > 0 ? data.payload.address.trim() : false;
    var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

    if(email)
    {
        if(name || address || password)
        {

            var token=typeof(data.headers.token) == 'string' ? data.headers.token : false;
            handlers._tokens.verifyToken(token,email,function(tokenIsValid)
            {
                if(tokenIsValid)
                {

                    _data.read('users',email,function(err,userData)
                    {
                        if(!err && userData)
                        {

                            if(name){userData.name=name}
                            if(address) {userData.address=address}
                            if(password){userData.password=helpers.hash(password)}
                            _data.update('users',email,userData,function(err)
                            {
                                if(!err)
                                {

                                    callback(200,{'Success':'successfully updated the user '})
                                }
                                else{
                                    callback(500,{'error':'Could not update the user'})
                                }

                            });
                        }
                        else{
                            callback(400,{'Error':'Specified user not available'})
                        }

                    });
                }
                else{
                    callback(403,{'error':'Missing required token in header'})
                }

            });

        }
        else{
            callback(400,{'Error':'Missing fields to udate'})
        }

    }
    else{
        callback(400,{'error':'missing required field'});
    }
}


handlers._users.delete=function(data,callback)
{
    var email=typeof(data.payload.email)=='string' && data.payload.email.trim().length>0? data.payload.email.trim() : false

    if(email)
    {

        var token = typeof(data.headers.token) == 'string' ? data.headers.token.trim() : false;
        if(token)
        {

            handlers._tokens.verifyToken(token,email,function(tokenIsValid)
            {

                if(tokenIsValid)
                {

                    _data.delete('users',email,function(err){

                        if(!err)
                        {
                            callback(false)
                        }
                        else
                        {
                            callback(500,{'error':'could not delete'})
                        }
                    });
                }
                else
                {
                    callback(400,{'Error':'token is required'})
                }
            });
        }
        else
        {
            callback(400,{'error':'Missing token'})
        }
      
    }
    else{
        callback(400,{'Error':'Missing required field'})
    }

}






handlers.tokens=function(data,callback)
{
    var acceptableMethods=['post','get','put','delete'];
    if(acceptableMethods.indexOf(data.method)>-1)
    {

        handlers._tokens[data.method](data,callback);
    }
    else{
        callback(405,{'error':'error'});
    }
}



handlers._tokens = {};

handlers._tokens.get=function(data,callback)
{
    var id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
    if(id){
      // Lookup the token
      _data.read('tokens',id,function(err,tokenData){
        if(!err && tokenData){
          callback(200,tokenData);
        } else {
          callback(404);
        }
      });
    } else {
      callback(400,{'Error' : 'Missing required field, or field invalid'})
    }
}



handlers._tokens.post=function(data,callback)
{
    console.log(data.payload);
     var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    var email= typeof(data.payload.email) == 'string' && data.payload.email.trim().length > 0  ? data.payload.email.trim() : false;
   
    if(password && email){
        console.log(email,password);
        _data.read('users', email, function(error, userData){
            if(!error && userData){

                console.log("inside");
                var hashedPassword = helpers.hash(password);

                if(hashedPassword == userData.password){

                    var token_id = helpers.generateToken();
                    var expires = Date.now() + 1000 * 60 * 60 * 24;
                    var token_obj = {
                        'email':email,
                        'token_id': token_id,
                        'expires': expires
                    };

                    _data.create('tokens', token_id, token_obj, function(error){
                        if(!error){
                            callback(200,{'Success':'login successfull'});
                        }else{
                            callback(500, {'Error': 'Error in create Token'});
                        }
                    });
                }
            }else{
                callback(500, {'Error': 'User with that email doesn\'t exist.'});
            }
        });
    }

}

handlers._tokens.put=function(data,callback)
{
    var id = typeof(data.payload.id) == 'string' && data.payload.id.trim().length == 20 ? data.payload.id.trim() : false;
    var extend = typeof(data.payload.extend) == 'boolean' && data.payload.extend == true ? true : false;
    if(id && extend){
      // Lookup the existing token
      _data.read('tokens',id,function(err,tokenData){
        if(!err && tokenData){
          // Check to make sure the token isn't already expired
          if(tokenData.expires > Date.now()){
            // Set the expiration an hour from now
            tokenData.expires = Date.now() + 1000 * 60 * 60;
            // Store the new updates
            _data.update('tokens',id,tokenData,function(err){
              if(!err){
                callback(200);
              } else {
                callback(500,{'Error' : 'Could not update the token\'s expiration.'});
              }
            });
          } else {
            callback(400,{"Error" : "The token has already expired, and cannot be extended."});
          }
        } else {
          callback(400,{'Error' : 'Specified user does not exist.'});
        }
      });
    } else {
      callback(400,{"Error": "Missing required field(s) or field(s) are invalid."});
    }
}

handlers._tokens.delete=function(data,callback)
{
    var id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
    if(id){
      // Lookup the token
      _data.read('tokens',id,function(err,tokenData){
        if(!err && tokenData){
          // Delete the token
          _data.delete('tokens',id,function(err){
            if(!err){
              callback(200);
            } else {
              callback(500,{'Error' : 'Could not delete the specified token'});
            }
          });
        } else {
          callback(400,{'Error' : 'Could not find the specified token.'});
        }
      });
    } else {
      callback(400,{'Error' : 'Missing required field'})
    }
}
  // Verify if a given token id is currently valid for a given user
  
  
  
handlers._tokens.verifyToken = function(id,email,callback){
    // Lookup the token
    console.log("id",id);
    _data.read('tokens',id,function(err,tokenData){
      if(!err && tokenData){
          console.log("name",email)
        // Check that the token is for the given user and has not expired
        console.log("tokenData",tokenData.email);
        if(tokenData.email == email && tokenData.expires > Date.now()){
          callback(true);
        } else {
          callback(false);
        }
      } else {
        callback(false);
      }
    });
  };




handlers.login=function(data,callback)
{
    if(data.method=='post')
    {
        handlers._tokens['post'](data,callback);
    }
    else
    {
        callback(405)
    }
}

handlers.logout=function(data,callback)
{
    if(data.method=='get')
    {

        var token=typeof(data.headers.token) == 'string' ? data.headers.token.trim() : false;
        if(token)
        {
            _data.delete('tokens', token, function(error){
                if(!error){
                    callback(200,{'Message':'logout'});
                }else{
                    callback(500, {'Error': 'Invalid token'});
                }
            });
        }
        else{
            callback(405, {'Error': 'Invalid token'});
        }
    }
    else
    {
        callback(405)
    }
}


handlers.menus=function(data,callback)
{
    if(data.method == 'get'){
        var token_id = typeof(data.headers.token) == 'string' ? data.headers.token.trim() : false;
        if(token_id){
            callback(200, {menus: menus});
        }else{
            callback(500, {'Error': 'Invalid Token'});
        }
    }else{
        callback(405);
    }
}



handlers.order=function(data,callback)
{
    if(data.method == 'post'){
        var email = typeof(data.payload.email) == 'string' && data.payload.email.trim().length > 0 ? data.payload.email.trim() : false;
        var items = typeof(data.payload.items) == 'string' && data.payload.items.trim().length > 0 ? data.payload.items.trim() : false;
        var name = typeof(data.payload.name) == 'string' && data.payload.name.trim().length > 0 ? data.payload.name.trim().length > 0 : false;
        var address = typeof(data.payload.address) == 'string' && data.payload.address.trim().length > 0 ? data.payload.address.trim() : false;
        console.log(email);
        console.log(items);
        console.log(name);
        console.log(address);
        if(items && name && email && address){
             var token_id = typeof(data.headers.token) == 'string' && data.headers.token.trim().length > 0 ? data.headers.token.trim() : false;
             if(token_id){
                _data.read('tokens', token_id, function(error, tokenData){
                    if(!error && tokenData){
                        stripe.payment(items, 'sathiyak@upspring.it', function(error, data){
                            callback(200,{"message":"success"});
                        });
                     }else{
                         console.log("else");
                         callback(500, tokenData);
                     }
                });
             }else{
                 callback(500, {'Error': 'Invalid token'});
             }
        }else{
            callback(500, {'Error': 'Missing required parameters'});
        }
    }else{
        callback(405);
    }
}






handlers.index=function(data,callback)
{
    console.log("inside");
    callback(200,{'message':'welcome to pizza order'});
}

module.exports=handlers;