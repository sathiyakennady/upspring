/*
 * Request Handlers
 *
 */

// Dependencies
var _data = require('./data');
var helpers = require('./helpers');
var config = require('./config');
var {emailReceipt} = require('./helpers');


var handlers = {};


handlers.index = function(data,callback){
  // Reject any request that isn't a GET
  if(data.method == 'get'){
    // Prepare data for interpolation
    var templateData = {
      'head.title' : 'Karumbairam Foods',
      'head.description' : 'Make an order and you will get home style food within few minutes',
      'body.class' : 'index'
    };
    // Read in a template as a string
    helpers.getTemplate('index',templateData,function(err,str){
      if(!err && str){
        // Add the universal header and footer
        helpers.addUniversalTemplates(str,templateData,function(err,str){
          if(!err && str){
            // Return that page as HTML
            callback(200,str,'html');
          } else {
            callback(500,undefined,'html');
          }
        });
      } else {
        callback(500,undefined,'html');
      }
    });
  } else {
    callback(405,undefined,'html');
  }
};

handlers.accountCreate = function(data,callback){
  // Reject any request that isn't a GET
  if(data.method == 'get'){
    // Prepare data for interpolation
    var templateData = {
      'head.title' : 'Create an Account',
      'head.description' : 'Signup is easy and only takes a few seconds.',
      'body.class' : 'accountCreate'
    };
    // Read in a template as a string
    helpers.getTemplate('accountCreate',templateData,function(err,str){
      if(!err && str){
        // Add the universal header and footer
        helpers.addUniversalTemplates(str,templateData,function(err,str){
          if(!err && str){
            // Return that page as HTML
            callback(200,str,'html');
          } else {
            callback(500,undefined,'html');
          }
        });
      } else {
        callback(500,undefined,'html');
      }
    });
  } else {
    callback(405,undefined,'html');
  }
};


handlers.sessionCreate = function(data,callback){
  // Reject any request that isn't a GET
  if(data.method == 'get'){
    // Prepare data for interpolation
    var templateData = {
      'head.title' : 'Login to  make an order.',
      'body.class' : 'sessionCreate'
    };
    // Read in a template as a string
    helpers.getTemplate('sessionCreate',templateData,function(err,str){
      if(!err && str){
        // Add the universal header and footer
        helpers.addUniversalTemplates(str,templateData,function(err,str){
          if(!err && str){
            // Return that page as HTML
            callback(200,str,'html');
          } else {
            callback(500,undefined,'html');
          }
        });
      } else {
        callback(500,undefined,'html');
      }
    });
  } else {
    callback(405,undefined,'html');
  }
};


handlers.accountEdit = function(data,callback){


  if(data.method == 'get'){
    // Prepare data for interpolation


    var templateData = {
      'head.title' : 'Cart Details',
      'body.class' : 'accountEdit'
    };

    // Read in a template as a string
    helpers.getTemplate('cartDetails',templateData,function(err,str){
      if(!err && str){
        // Add the universal header and footer
        helpers.addUniversalTemplates(str,templateData,function(err,str){
          if(!err && str){
            // Return that page as HTM
              // L


            callback(200,str,'html');
          } else {
            callback(500,undefined,'html');
          }
        });
      } else {
        callback(500,undefined,'html');
      }
    });
  } else {
    callback(405,undefined,'html');
  }
};


handlers.sessionDeleted = function(data,callback){
  // Reject any request that isn't a GET
  if(data.method == 'get'){
    // Prepare data for interpolation
    var templateData = {
      'head.title' : 'Logged Out',
      'head.description' : 'You have been logged out of your account.',
      'body.class' : 'sessionDeleted'
    };
    // Read in a template as a string
    helpers.getTemplate('sessionDeleted',templateData,function(err,str){
      if(!err && str){
        // Add the universal header and footer
        helpers.addUniversalTemplates(str,templateData,function(err,str){
          if(!err && str){
            // Return that page as HTML
            callback(200,str,'html');
          } else {
            callback(500,undefined,'html');
          }
        });
      } else {
        callback(500,undefined,'html');
      }
    });
  } else {
    callback(405,undefined,'html');
  }
};


handlers.accountDeleted = function(data,callback){
  // Reject any request that isn't a GET
  if(data.method == 'get'){
    // Prepare data for interpolation
    var templateData = {
      'head.title' : 'Account Deleted',
      'head.description' : 'Your account has been deleted.',
      'body.class' : 'accountDeleted'
    };
    // Read in a template as a string
    helpers.getTemplate('accountDeleted',templateData,function(err,str){
      if(!err && str){
        // Add the universal header and footer
        helpers.addUniversalTemplates(str,templateData,function(err,str){
          if(!err && str){
            // Return that page as HTML
            callback(200,str,'html');
          } else {
            callback(500,undefined,'html');
          }
        });
      } else {
        callback(500,undefined,'html');
      }
    });
  } else {
    callback(405,undefined,'html');
  }
};


handlers.checksCreate = function(data,callback){
  // Reject any request that isn't a GET
  if(data.method == 'get'){


    var templateData = {
      'head.title' : 'Make a payment',
      'body.class' : 'checksCreate'
    };
    // Read in a template as a string
    helpers.getTemplate('makePayment',templateData,function(err,str){
      if(!err && str){
        // Add the universal header and footer
        helpers.addUniversalTemplates(str,templateData,function(err,str){
          if(!err && str){
            // Return that page as HTML
            callback(200,str,'html');
          } else {
            callback(500,undefined,'html');
          }
        });
      } else {
        callback(500,undefined,'html');
      }
    });
  } else {
    callback(405,undefined,'html');
  }
};


handlers.paymentDetails=function(data,callback){

    var email=typeof(data.queryStringObject.email) == 'string' && data.queryStringObject.email.trim().length > 0 ? data.queryStringObject.email.trim() : false;
    if(email)
    {
        _data.read('checks',email,function(err,data){

            if(!err && data){

              var item=data.item;
              var cost=0;
              item.forEach(function(checkId){

                    cost  += checkId.mealQuantity * checkId.mealCost ;

              });
              var orderData ={
                  'subtotal':'$'+cost,
                  'deliveryCharge':'$5.5',
                  'TotalCost':'$'+(cost+5.5)
              }


              callback(200,orderData);
            }

        });

    }
    else
    {
        callback(400,{'Error':'Missing required fields'})
    }

}


handlers.makePayment=function(data,callback){
    var email=typeof(data.payload.email) == 'string' && data.payload.email.trim().length > 0 ? data.payload.email.trim() : false;
    var stripeToken= typeof(data.payload.stripe) == 'string' && data.payload.stripe.trim().length > 0 ? data.payload.stripe.trim() : false;

    console.log("email--->",email);
    console.log("stripe---->",stripeToken);
  if(email && stripeToken)
  {

      var orderData={};
      var userData={};

      _data.read('checks',email,function(err,data){

          if(!err && data){
            //callback(200,data);

              console.log("data",data);
              var item=data.item;
              var cost=0;
              item.forEach(function(checkId){

                  cost  += checkId.mealQuantity * checkId.mealCost ;

              });
              orderData={
                item:data.item,
                Subcost:"$"+cost,
                DeliveryCharge:"$"+5.5,
                TotalCost:"$"+(cost+5.5)

              };

              helpers.chargeCustomer((cost+5.5),stripeToken,err=>{
                if(!err)
              {
                  console.log("after charge customer");

                  emailReceipt(orderData,err=>{


                      if(!err){



                  var userObject = {

                      'email' : email,
                      'item'  :[]
                  };

                  // Store the user
                  _data.update('checks',email,userObject,function(err){
                      if(!err){
                          console.log("after email sent");
                           callback(200);
                      } else {
                          callback(500,{'Error' : 'Could not create the user carts'});
                      }
                  });


              }else{
                          console.log("inside else");
              //    console.log(err)
              }
              });
              }
              else
              {
                  callback(400,{'ERROR':'Payment failed'});
              }
              });



          }
          else
          {
            callback(400,{'Error':'No orders found '})
          }

      });




  }
  else
  {
    callback(400,{'Error':'Missing required fields'})
  }

};




handlers.orderSuccessfull=function(data,callback){

    if(data.method == 'get'){
        // Prepare data for interpolation
        var templateData = {
            'head.title' : 'Order Successfull',
            'body.class' : 'checksList'
        };
        // Read in a template as a string
        helpers.getTemplate('orderSuccessfull',undefined,function(err,str){
            if(!err && str){
                // Add the universal header and footer
                helpers.addUniversalTemplates(str,undefined,function(err,str){
                    if(!err && str){

                        // Return that page as HTML
                        callback(200,str,'html');
                    } else {
                        callback(500,undefined,'html');
                    }
                });
            } else {
                callback(500,undefined,'html');
            }
        });
    } else {
        callback(405,undefined,'html');
    }
}


handlers.menuList = function(data,callback){
  // Reject any request that isn't a GET
  if(data.method == 'get'){
    // Prepare data for interpolation
    var templateData = {
      'head.title' : 'Make an order',
      'body.class' : 'checksList'
    };
    // Read in a template as a string
    helpers.getTemplate('menuList',templateData,function(err,str){
      if(!err && str){
        // Add the universal header and footer
        helpers.addUniversalTemplates(str,templateData,function(err,str){
          if(!err && str){

            // Return that page as HTML
            callback(200,str,'html');
          } else {
            callback(500,undefined,'html');
          }
        });
      } else {
        callback(500,undefined,'html');
      }
    });
  } else {
    callback(405,undefined,'html');
  }
};


handlers.carts=function(data,callback){

    var email=typeof(data.queryStringObject.email) == 'string' && data.queryStringObject.email.trim().length > 0 ? data.queryStringObject.email.trim() : false;
    if(email)
    {
        _data.read('checks',email,function(err,data){

            if(!err && data){callback(200,data);}

        });

    }
    else
    {
        callback(400,{'Error':'Missing required fields'})
    }



};

/*handlers.checksEdit = function(data,callback){
  // Reject any request that isn't a GET
  if(data.method == 'get'){
    // Prepare data for interpolation
    var templateData = {
      'head.title' : 'Check Details',
      'body.class' : 'checksEdit'
    };
    // Read in a template as a string
    helpers.getTemplate('checksEdit',templateData,function(err,str){
      if(!err && str){
        // Add the universal header and footer
        helpers.addUniversalTemplates(str,templateData,function(err,str){
          if(!err && str){
            // Return that page as HTML
            callback(200,str,'html');
          } else {
            callback(500,undefined,'html');
          }
        });
      } else {
        callback(500,undefined,'html');
      }
    });
  } else {
    callback(405,undefined,'html');
  }
};*/


/*handlers.favicon = function(data,callback){
  // Reject any request that isn't a GET
  if(data.method == 'get'){
    // Read in the favicon's data
    helpers.getStaticAsset('favicon.ico',function(err,data){
      if(!err && data){
        // Callback the data
        callback(200,data,'favicon');
      } else {
        callback(500);
      }
    });
  } else {
    callback(405);
  }
};*/


handlers.public = function(data,callback){
  // Reject any request that isn't a GET
  if(data.method == 'get'){
    // Get the filename being requested
    var trimmedAssetName = data.trimmedPath.replace('public/','').trim();
    if(trimmedAssetName.length > 0){
      // Read in the asset's data
      helpers.getStaticAsset(trimmedAssetName,function(err,data){
        if(!err && data){

          // Determine the content type (default to plain text)
          var contentType = 'plain';

          if(trimmedAssetName.indexOf('.css') > -1){
            contentType = 'css';
          }

          if(trimmedAssetName.indexOf('.png') > -1){
            contentType = 'png';
          }

          if(trimmedAssetName.indexOf('.jpg') > -1){
            contentType = 'jpg';
          }

          if(trimmedAssetName.indexOf('.ico') > -1){
            contentType = 'favicon';
          }

          // Callback the data
          callback(200,data,contentType);
        } else {
          callback(404);
        }
      });
    } else {
      callback(404);
    }

  } else {
    callback(405);
  }
};


handlers.ping = function(data,callback){
    callback(200);
};

// Not-Found
handlers.notFound = function(data,callback){
  callback(404);
};

handlers.users = function(data,callback){
  var acceptableMethods = ['post','get','put','delete'];
  if(acceptableMethods.indexOf(data.method) > -1){
    handlers._users[data.method](data,callback);
  } else {
    callback(405);
  }
};

// Container for all the users methods
handlers._users  = {};






handlers._users.post = function(data,callback){
  // Check that all required fields are filled out
  var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
  var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
  var email = typeof(data.payload.email) == 'string' && data.payload.email.trim().length > 0 ? data.payload.email.trim() : false;
  var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
  var tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? true : false;


  if(firstName && lastName && email && password ){
    // Make sure the user doesnt already exist
    _data.read('users',email,function(err,data){
      if(err){
        // Hash the password
        var hashedPassword = helpers.hash(password);

        // Create the user object
        if(hashedPassword){
          var userObject = {
            'firstName' : firstName,
            'lastName' : lastName,
            'email' : email,
            'hashedPassword' : hashedPassword,
            'tosAgreement' : true
          };

          // Store the user
          _data.create('users',email,userObject,function(err){
            if(!err){
                _data.read('checks',email,function(err,data) {
                    if (err) {
                        var userObject = {

                            'email' : email,
                            'item'  :[]
                        };
                        _data.create('checks',email,userObject,function(err){
                            if(!err){
                                callback(200);
                            } else {
                                callback(500,{'Error' : 'Could not create the user carts'});
                            }
                        });
                    }
                });
            } else {
              callback(500,{'Error' : 'Could not create the new user'});
            }
          });
        } else {
          callback(500,{'Error' : 'Could not hash the user\'s password.'});
        }

      } else {
        // User alread exists
        callback(400,{'Error' : 'A user with that email  already exists'});
      }
    });

  } else {
    callback(400,{'Error' : 'Missing required fields'});
  }

};



handlers._users.get = function(data,callback){


  var email= typeof(data.queryStringObject.email) == 'string' && data.queryStringObject.email.trim().length >0 ? data.queryStringObject.email.trim() : false;
  if(email){


    var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
    handlers._tokens.verifyToken(token,email,function(tokenIsValid){
      if(tokenIsValid){

        _data.read('users',email,function(err,data){
          if(!err && data){

            delete data.hashedPassword;
            callback(200,data);
          } else {
            callback(404);
          }
        });
      } else {
        callback(403,{"Error" : "Missing required token in header, or token is invalid."})
      }
    });
  } else {
    callback(400,{'Error' : 'Missing required field'})
  }
};


handlers._users.put = function(data,callback){
  // Check for required field
  var email = typeof(data.payload.email) == 'string' && data.payload.email.trim().length >0 ? data.payload.email.trim() : false;

  // Check for optional fields
  var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
  var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
  var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

  // Error if phone is invalid
  if(email){
    // Error if nothing is sent to update
    if(firstName || lastName || password){

      // Get token from headers
      var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

      // Verify that the given token is valid for the phone number
      handlers._tokens.verifyToken(token,email,function(tokenIsValid){
        if(tokenIsValid){

          // Lookup the user
          _data.read('users',email,function(err,userData){
            if(!err && userData){
              // Update the fields if necessary
              if(firstName){
                userData.firstName = firstName;
              }
              if(lastName){
                userData.lastName = lastName;
              }
              if(password){
                userData.hashedPassword = helpers.hash(password);
              }
              // Store the new updates
              _data.update('users',email,userData,function(err){
                if(!err){
                  callback(200);
                } else {
                  callback(500,{'Error' : 'Could not update the user.'});
                }
              });
            } else {
              callback(400,{'Error' : 'Specified user does not exist.'});
            }
          });
        } else {
          callback(403,{"Error" : "Missing required token in header, or token is invalid."});
        }
      });
    } else {
      callback(400,{'Error' : 'Missing fields to update.'});
    }
  } else {
    callback(400,{'Error' : 'Missing required field.'});
  }

};


handlers._users.delete = function(data,callback){
  // Check that phone number i s valid
  var email = typeof(data.queryStringObject.email) == 'string' && data.queryStringObject.email.trim().length > 0 ? data.queryStringObject.email.trim() : false;
  if(email){

    // Get token from headers
    var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

    // Verify that the given token is valid for the phone number
    handlers._tokens.verifyToken(token,email,function(tokenIsValid){
      if(tokenIsValid){
        // Lookup the user
        _data.read('users',email,function(err,userData){
          if(!err && userData){
            // Delete the user's data
            _data.delete('users',email,function(err){
              if(!err){
                // Delete each of the checks associated with the user
                var userChecks = typeof(userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks : [];
                var checksToDelete = userChecks.length;
                if(checksToDelete > 0){
                  var checksDeleted = 0;
                  var deletionErrors = false;
                  // Loop through the checks
                  userChecks.forEach(function(checkId){
                    // Delete the check
                    _data.delete('checks',checkId,function(err){
                      if(err){
                        deletionErrors = true;
                      }
                      checksDeleted++;
                      if(checksDeleted == checksToDelete){
                        if(!deletionErrors){
                          callback(200);
                        } else {
                          callback(500,{'Error' : "Errors encountered while attempting to delete all of the user's checks. All checks may not have been deleted from the system successfully."})
                        }
                      }
                    });
                  });
                } else {
                  callback(200);
                }
              } else {
                callback(500,{'Error' : 'Could not delete the specified user'});
              }
            });
          } else {
            callback(400,{'Error' : 'Could not find the specified user.'});
          }
        });
      } else {
        callback(403,{"Error" : "Missing required token in header, or token is invalid."});
      }
    });
  } else {
    callback(400,{'Error' : 'Missing required field'})
  }
};

// Tokens
handlers.tokens = function(data,callback){
  var acceptableMethods = ['post','get','put','delete'];
  if(acceptableMethods.indexOf(data.method) > -1){
    handlers._tokens[data.method](data,callback);
  } else {
    callback(405);
  }
};

// Container for all the tokens methods
handlers._tokens  = {};

handlers._tokens.post = function(data,callback){
  var email = typeof(data.payload.email) == 'string' && data.payload.email.trim().length > 0 ? data.payload.email.trim() : false;
  var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;



  if(email && password){
    // Lookup the user who matches that phone number
    _data.read('users',email,function(err,userData){
      if(!err && userData){
        // Hash the sent password, and compare it to the password stored in the user object
        var hashedPassword = helpers.hash(password);
        if(hashedPassword == userData.hashedPassword){
          // If valid, create a new token with a random name. Set an expiration date 1 hour in the future.
          var tokenId = helpers.createRandomString(20);
          var expires = Date.now() + 1000 * 60 * 60;
          var tokenObject = {
            'email' : email,
            'id' : tokenId,
            'expires' : expires
          };



          // Store the token
          _data.create('tokens',tokenId,tokenObject,function(err){
            if(!err){
              callback(200,tokenObject);
            } else {
              callback(500,{'Error' : 'Could not create the new token'});
            }
          });

        } else {
          callback(400,{'Error' : 'Password did not match the specified user\'s stored password'});
        }
      } else {
        callback(400,{'Error' : 'Could not find the specified user.'});
      }
    });
  } else {
    callback(400,{'Error' : 'Missing required field(s).'})
  }
};


handlers._tokens.get = function(data,callback){
  // Check that id is valid
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
};

// Tokens - put
// Required data: id, extend
// Optional data: none
handlers._tokens.put = function(data,callback){
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
};


// Tokens - delete
// Required data: id
// Optional data: none
handlers._tokens.delete = function(data,callback){
  // Check that id is valid
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
};

// Verify if a given token id is currently valid for a given user
handlers._tokens.verifyToken = function(id,email,callback){
  // Lookup the token
  _data.read('tokens',id,function(err,tokenData){
    if(!err && tokenData){
      // Check that the token is for the given user and has not expired
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

// Checks
handlers.checks = function(data,callback){
  var acceptableMethods = ['post','get','put','delete'];
  if(acceptableMethods.indexOf(data.method) > -1){
    handlers._checks[data.method](data,callback);
  } else {
    callback(405);
  }
};

// Container for all the checks methods
handlers._checks  = {};


// Checks - post
// Required data: protocol,url,method,successCodes,timeoutSeconds
// Optional data: none
handlers._checks.post = function(data,callback) {
    // Validate inputs
    var cartId = typeof(data.payload.cartId) == 'string' && data.payload.cartId.trim().length > 0 ? data.payload.cartId : false;
    var mealId = typeof(data.payload.mealId) == 'string' && data.payload.mealId.trim().length > 0 ? data.payload.mealId.trim() : false;
    var mealName = typeof(data.payload.mealName) == 'string' && data.payload.mealName.trim().length > 0 ? data.payload.mealName : false;
    var mealCost = typeof(data.payload.mealCost) == 'string' && data.payload.mealCost.trim().length > 0 ? data.payload.mealCost : false;
    var remove = typeof (data.payload.remove) == 'boolean' ? data.payload.remove : false;

    if (cartId && mealId && mealName && mealCost) {
        _data.read('checks', cartId, (err, cartData) => {
            if (!err && cartData)
        {
            var _meal = typeof (cartData.item.find(item => item.mealId == mealId)) !=='undefined' ? cartData.item.find(item => item.mealId == mealId) :false;

            if (_meal) {
                if (remove) {
                    if (_meal.quantity <= 1) {
                        cartData = handlers.updateCartItems(cartData, mealId, false, true);
                    } else {
                        cartData = handlers.updateCartItems(cartData, mealId, true);
                    }
                } else {
                    cartData = handlers.updateCartItems(cartData, mealId);
                }
            }
            if (!_meal && !remove) {

                var mealData={'mealId':mealId,
                    'mealName':mealName,
                    'mealCost':Number(mealCost),
                    'mealQuantity':1};

                cartData.item.push(mealData);

                _data.update('checks', cartId, cartData, err => {
                    if (!err) {callback(200,cartData); }
            else {callback(500, {'Error': 'Failed to update cartData'});}
            });

            }
            else{
                //saving the data to disc
                _data.update('checks', cartId, cartData, err => {
                    if (!err) {
                    callback(200,cartData);
                } else {
                    callback(500, {
                        'Error': 'Failed to update cartData'
                    });
                }
            });
            }




        }
    else
        {
            callback(400, {'Error': 'Card not found'});
        }
    })


    }

    else {
        callback(400, {'Error': 'Missing required inputs, or inputs are invalid'});
    }


}


handlers.updateCartItems = (cartData, mealId, reduce, remove) => {
    var _meal = typeof (cartData.item.find(item => item.mealId == mealId)) !== 'undefined' ? cartData.item.find(item => item.mealId == mealId) : false;
    var mealPosition = cartData.item.indexOf(_meal);

    if (reduce) {
        _meal.mealQuantity--;
        if (mealPosition) {
            //replacing the item
            cartData.item[mealPosition] = _meal;
        }
    }
    if (remove) {
        if (typeof (mealPosition) == 'number') {
            //replacing the item
            cartData.item.splice(mealPosition, 1);
        }
    }
    if (!remove && !reduce) {
        _meal.mealQuantity++;
        console.log(_meal);
        cartData.item[mealPosition] = _meal;
    }
    return cartData;
}





// Checks - get
// Required data: id
// Optional data: none
handlers._checks.get = function(data,callback){
  // Check that id is valid
  var id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
  if(id){
    // Lookup the check
    _data.read('checks',id,function(err,checkData){
      if(!err && checkData){
        // Get the token that sent the request
        var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
        // Verify that the given token is valid and belongs to the user who created the check
        handlers._tokens.verifyToken(token,checkData.useremail,function(tokenIsValid){
          if(tokenIsValid){
            // Return check data
            callback(200,checkData);
          } else {
            callback(403);
          }
        });
      } else {
        callback(404);
      }
    });
  } else {
    callback(400,{'Error' : 'Missing required field, or field invalid'})
  }
};


handlers._checks.put = function(data,callback){

    var cartId = typeof(data.payload.cartId) == 'string' && data.payload.cartId.trim().length > 0 ? data.payload.cartId : false;
    var mealId = typeof(data.payload.mealId) == 'string' && data.payload.mealId.trim().length > 0 ? data.payload.mealId.trim() : false;
    var remove = typeof (data.payload.remove) == 'boolean' ? data.payload.remove : false;

    if (cartId && mealId ) {
        _data.read('checks', cartId, (err, cartData) => {
            if (!err && cartData)
        {
            var _meal = typeof (cartData.item.find(item => item.mealId == mealId)) !=='undefined' ? cartData.item.find(item => item.mealId == mealId) :false;

            if (_meal) {
                if (remove) {
                    if (_meal.quantity <= 1) {
                        cartData = handlers.updateCartItems(cartData, mealId, false, true);
                    } else {
                        cartData = handlers.updateCartItems(cartData, mealId, true);
                    }
                } else {
                    cartData = handlers.updateCartItems(cartData, mealId);
                }
            }
            if (!_meal && !remove) {

                var mealData={'mealId':mealId,
                    'mealName':mealName,
                    'mealCost':mealCost,
                    'mealQuantity':1};

                cartData.item.push(mealData);

                _data.update('checks', cartId, cartData, err => {
                    if (!err) {callback(200,cartData); }
            else {callback(500, {'Error': 'Failed to update cartData'});}
            });

            }
            else{
                //saving the data to disc
                _data.update('checks', cartId, cartData, err => {
                    if (!err) {
                    callback(200,cartData);
                } else {
                    callback(500, {
                        'Error': 'Failed to update cartData'
                    });
                }
            });
            }
        }
    else{callback(400, {'Error': 'Card not found'});}
    })
    }
    else {
        callback(400, {'Error': 'Missing required inputs, or inputs are invalid'});
    }


};


handlers._checks.delete = function(data,callback){
  // Check that id is valid
  var id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
  if(id){
    // Lookup the check
    _data.read('checks',id,function(err,checkData){
      if(!err && checkData){
        // Get the token that sent the request
        var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
        // Verify that the given token is valid and belongs to the user who created the check
        handlers._tokens.verifyToken(token,checkData.useremail,function(tokenIsValid){
          if(tokenIsValid){

            // Delete the check data
            _data.delete('checks',id,function(err){
              if(!err){
                // Lookup the user's object to get all their checks
                _data.read('users',checkData.useremail,function(err,userData){
                  if(!err){
                    var userChecks = typeof(userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks : [];

                    // Remove the deleted check from their list of checks
                    var checkPosition = userChecks.indexOf(id);
                    if(checkPosition > -1){
                      userChecks.splice(checkPosition,1);
                      // Re-save the user's data
                      userData.checks = userChecks;
                      _data.update('users',checkData.useremail,userData,function(err){
                        if(!err){
                          callback(200);
                        } else {
                          callback(500,{'Error' : 'Could not update the user.'});
                        }
                      });
                    } else {
                      callback(500,{"Error" : "Could not find the check on the user's object, so could not remove it."});
                    }
                  } else {
                    callback(500,{"Error" : "Could not find the user who created the check, so could not remove the check from the list of checks on their user object."});
                  }
                });
              } else {
                callback(500,{"Error" : "Could not delete the check data."})
              }
            });
          } else {
            callback(403);
          }
        });
      } else {
        callback(400,{"Error" : "The check ID specified could not be found"});
      }
    });
  } else {
    callback(400,{"Error" : "Missing valid id"});
  }
};


// Export the handlers
module.exports = handlers;
