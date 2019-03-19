var helpers = require('../helpers');
var _data = require('../data');
var verifyToken = require('./tokens').verifyToken;
var {createCart} = require('./carts');
var util = require('util');
var debug = util.debuglog('users');
//container for the module
var handlers = {};



handlers.emailIsTaken = (email, callback) => {
	//read the user Email matcher file
	_data.read('matcher', 'matcher', (err, data) => {

		if (!err) {
      console.log(data)
			emailList = typeof (data) == 'object' ? data : {};
			emailIsTaken = typeof (emailList[email]) !== 'undefined' ? true : false;
			callback(emailIsTaken);
		} else {
			callback(err);
		}
	})
};


handlers._users={};

handlers.users=function(data,callback)
{
  console.log(data);
  console.log(data.method);
  var acceptedMethods = ['post', 'get', 'put', 'delete'];
	if (acceptedMethods.indexOf(data.method) > -1) {
		 handlers._users[data.method](data,callback);
	} else {
		callback(403, {
			'message': 'method not allowed'
		});
		debug('Error', data.method);
	}
}


handlers._users.get = (data, callback) => {
	//required
	var userId = typeof (data.queryStringObject.userId) == 'string' && data.queryStringObject.userId.trim().length == 20 ? data.queryStringObject.userId.trim() : false;
	var token = typeof (data.headers.token) == 'string' && data.headers.token.trim().length == 20 ? data.headers.token.trim() : false;
	if (userId && token) {
		//verifying the token supplied
		verifyToken(userId, token, tokenNotValid => {
			if (!tokenNotValid) {
				//lookup user
				_data.read('users', userId, (err, userData) => {
					if (!err && userData) {
						delete userData.hashedPassword;
						callback(200, userData);
					} else {
						callback(404, {
							'Error': 'User not found'
						});
					}
				});

			} else {
				callback(400, {
					'Error': 'Invalid token was supplied'
				});
			}
		});
	} else {
		callback(400, {
			'Error': 'Missing required fields'
		});
	}

};


handlers._users.post = (data, callback) =>{
  var firstName = typeof (data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
	var lastName = typeof (data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
	var email = typeof (data.payload.email) == 'string' && helpers.validateEmail(data.payload.email.trim()) ? data.payload.email.trim() : false;
	var streetAddress = typeof (data.payload.streetAddress) == 'string' && data.payload.streetAddress.trim().length > 0 ? data.payload.streetAddress : false;

	var password = typeof (data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
	var tosAgreement = typeof (data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? true : false;

  if(firstName && lastName && email && streetAddress && password && tosAgreement)
  {
     var userId=helpers.createRandomString(20),
     userObject={
       userId,
       firstName,
       lastName,
       email,
       'hashedPassword':helpers.hash(password),
        streetAddress
     }

     handlers.emailIsTaken(email,emailIsTaken =>{
       console.log(emailIsTaken);
      if(!emailIsTaken)
      {
          _data.read('matcher','matcher',function(err,mathcerData)
        {
            if(!err)
            {
              matcherData=typeof(matcherData) == 'object' ?matcherData :{}
              matcherData[email]=userId;
              _data.update('matcher', 'matcher', matcherData, err => {
							if (!err) {
								//add the user to the fs
								_data.create('users', userId, userObject, err => {
									if (!err) {
										//creating user's permanent shopping cart
										createCart(userId, err => {
											if (!err) {
												callback(200,{'Success':'created successfully'});
											} else {
												callback(500);
												debug(err);
											}
										});
									} else {
										callback(500, {'Error': 'Failed to create the user'});
									}
								});
							} else {
								callback(500,{'error':'failed to update matcher'});
							}
						});
            }
            else {
              callbak(500,{'Error':'failed to update '})
            }
        })
      }
      else {
        callback(400, {	'Error': 'email is taken' });
      }
   });
  }
  else {
    callback(400,{'Error':'Missing Requried '})
  }


}

handlers._users.put = (data, callback) => {
	//Required data
	var userId = typeof (data.queryStringObject.userId) == 'string' && data.queryStringObject.userId.trim().length == 20 ? data.queryStringObject.userId.trim() : false;
	//optional data
	var firstName = typeof (data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName : false;
	var lastName = typeof (data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName : false;
	var email = typeof (data.payload.email) == 'string' && helpers.validateEmail(data.payload.email.trim()) ? data.payload.email.trim() : false;
	var streetAddress = typeof (data.payload.streetAddress) == 'string' && data.payload.streetAddress.trim().length > 0 ? data.payload.streetAddress : false;

	var password = typeof (data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password : false;

	var token = typeof (data.headers.token) == 'string' && data.headers.token.trim().length == 20 ? data.headers.token.trim() : false;
	if (userId && token) {
		//verifying the token supplied
		verifyToken(userId, token, tokenNotValid => {
			if (!tokenNotValid) {
				//check if any field to update was
				if (firstName || lastName || email || password || streetAddress) {
					//reading the user
					_data.read('users', userId, (err, userData) => {
						if (!err && userData) {
							//updating the email
							if (email) {
								//check if email is not taken
								//Conditional-upadating the rest of the data in this condition because of the special treatment of the email updating process
								handlers.emailIsTaken(email, emailIsTaken => {
									if (!emailIsTaken) {
										//reading the matcher file to update the new infomation
										_data.read('matcher', 'matcher', (err, matcherData) => {
											//removing the old email
											if (matcherData[userData.email]) {
												delete matcherData[userData.email];
											} else {
												debug("Email not found in the matcher");
											}

											//adding new email
											matcherData[email] = userData.userId;

											//updatingthe matcher file
											_data.update('matcher', 'matcher', matcherData, err => {
												if (err) {
													debug(err);
												}
											});
											//adding the userdata
											userData.email = email
											if (firstName) {
												userData.firstName = firstName
											}
											if (lastName) {
												userData.lastName = lastName
											}
											if (password) {
												userData.hashedPassword = helpers.hash(password)
											}
											if (streetAddress) {
												userData.streetAddress = streetAddress
											}
											//writing the updated data to disc
											_data.update('users', userId, userData, err => {
												if (!err) {
													callback(200);
												} else {
													callback(500, {
														'Error': "Failed to update the user"
													});
												}
											});

										});
									} else {
										callback(400, {
											'Error': 'email is taken'
										});
									}
								});
							} else {
								//Note- updating the fields as normal since the is no email to be updated
								if (firstName) {
									userData.firstName = firstName
								}
								if (lastName) {
									userData.lastName = lastName
								}
								if (password) {
									userData.hashedPassword = helpers.hash(password)
								}
								if (streetAddress) {
									userData.streetAddress = streetAddress
								}
								//writing the updated info to Disc
								_data.update('users', userId, userData, err => {
									if (!err) {
										callback(200);
									} else {
										callback(500, {
											'Error': 'failed to update user'
										});
										debug(err);
									}
								});
							}
						} else {
							callback(404, {
								'Error': 'User not found'
							});
						}
					});
				}

			} else {
				callback(400, {
					'Error': 'Invalid token was supplied'
				});
			}
		});
	} else {
		callback(400, {
			'Error': 'Missing required fields'
		});
	}
};



handlers._users.delete = (data, callback) => {
	var userId = typeof (data.queryStringObject.userId) == 'string' && data.queryStringObject.userId.trim().length == 20 ? data.queryStringObject.userId.trim() : false;

	var token = typeof (data.headers.token) == 'string' && data.headers.token.trim().length == 20 ? data.headers.token.trim() : false;
	if (userId && token) {
		//verifying the token supplied
		verifyToken(userId, token, tokenNotValid => {
			if (!tokenNotValid) {
				//read the user from the fileSystem
				_data.read('users', userId, (err, userData) => {
					if (!err && userData) {
						userEmail = userData.email;
						//reading the matcher and deleting the user match
						_data.read('matcher', 'matcher', (err, matcherData) => {
							if (!err && matcherData) {
								//delete the user matcher
								delete matcherData[userEmail];
								//updating the matcher in the fs
								_data.update('matcher', 'matcher', matcherData, err => {
									if (!err) {
										//proceeding to delete user from fs
										_data.delete('users', userId, err => {
											if (!err) {
												//thern remove thier cart from the Disc
												//using the userId since its the same as the cart id
												_data.delete('carts', userId, err => {
													if (!err) {
														//deleting users's orders
														//--reading the orders collection
														_data.listDocs('orders', (err, fileNames) => {
															if (!err && fileNames) {
																//loop through the orders
																fileNames.forEach(fileName => {
																	//remove the .json
																	fileName = fileName.replace('.json', '');
																	_data.read('orders', fileName, (err, orderData) => {
																		if (!err && orderData) {
																			//check if an the order has the same cartId as the users's
																			if (orderData.userEmail == userEmail) {
																				_data.delete('orders', fileName, err => {
																					if (!err) {
																						debug('Deletion successful');
																					} else {
																						debug('Failed to delete one of the order document');
																					}
																				});
																			}
																		} else {
																			debug(err);
																		}
																	});
																})
															} else {
																debug(err);
															}
														});

														callback(200);
													} else {
														callback(500, {
															'Error': 'User deleted but an Error occured'
														});
														debug(err);
													}
												});
											} else {
												callback(500, {
													'Error': 'Failed delete user'
												});
											}
										})
									} else {
										callback(500);
										debug('failed to update matcher with new data');
									}
								});
							} else {
								callback(500);
								debug("could not open matcher file");
							}
						});
					} else {
						callback(404, {
							'Error': 'User not found'
						});
					}
				});

			} else {
				callback(400, {
					'Error': 'Invalid token was supplied'
				});
			}
		});
	} else {
		callback(400, {
			'Error': 'Missing required fields'
		});
	}


};

module.exports=handlers;
