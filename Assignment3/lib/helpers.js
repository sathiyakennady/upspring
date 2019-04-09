/*
 * Helpers for various tasks
 *
 */

// Dependencies
var config = require('./config');
var crypto = require('crypto');
var https = require('https');
var querystring = require('querystring');
var path = require('path');
var fs = require('fs');

// Container for all the helpers
var helpers = {};

// Parse a JSON string to an object in all cases, without throwing
helpers.parseJsonToObject = function(str){
  try{
    var obj = JSON.parse(str);
    return obj;
  } catch(e){
    return {};
  }
};

// Create a SHA256 hash
helpers.hash = function(str){
  if(typeof(str) == 'string' && str.length > 0){
    var hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
    return hash;
  } else {
    return false;
  }
};

// Create a string of random alphanumeric characters, of a given length
helpers.createRandomString = function(strLength){
  strLength = typeof(strLength) == 'number' && strLength > 0 ? strLength : false;
  if(strLength){
    // Define all the possible characters that could go into a string
    var possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';

    // Start the final string
    var str = '';
    for(i = 1; i <= strLength; i++) {
        // Get a random charactert from the possibleCharacters string
        var randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
        // Append this character to the string
        str+=randomCharacter;
    }
    // Return the final string
    return str;
  } else {
    return false;
  }
};

helpers.sendTwilioSms = function(phone,msg,callback){
  // Validate parameters
  phone = typeof(phone) == 'string' && phone.trim().length == 10 ? phone.trim() : false;
  msg = typeof(msg) == 'string' && msg.trim().length > 0 && msg.trim().length <= 1600 ? msg.trim() : false;
  if(phone && msg){

    // Configure the request payload
    var payload = {
      'From' : config.twilio.fromPhone,
      'To' : '+1'+phone,
      'Body' : msg
    };
    var stringPayload = querystring.stringify(payload);


    // Configure the request details
    var requestDetails = {
      'protocol' : 'https:',
      'hostname' : 'api.twilio.com',
      'method' : 'POST',
      'path' : '/2010-04-01/Accounts/'+config.twilio.accountSid+'/Messages.json',
      'auth' : config.twilio.accountSid+':'+config.twilio.authToken,
      'headers' : {
        'Content-Type' : 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(stringPayload)
      }
    };

    // Instantiate the request object
    var req = https.request(requestDetails,function(res){
        // Grab the status of the sent request
        var status =  res.statusCode;
        // Callback successfully if the request went through
        if(status == 200 || status == 201){
          callback(false);
        } else {
          callback('Status code returned was '+status);
        }
    });

    // Bind to the error event so it doesn't get thrown
    req.on('error',function(e){
      callback(e);
    });

    // Add the payload
    req.write(stringPayload);

    // End the request
    req.end();

  } else {
    callback('Given parameters were missing or invalid');
  }
};

// Get the string content of a template, and use provided data for string interpolation
helpers.getTemplate = function(templateName,data,callback){
  templateName = typeof(templateName) == 'string' && templateName.length > 0 ? templateName : false;
  data = typeof(data) == 'object' && data !== null ? data : {};
  if(templateName){
    var templatesDir = path.join(__dirname,'/../templates/');
    fs.readFile(templatesDir+templateName+'.html', 'utf8', function(err,str){
      if(!err && str && str.length > 0){
        // Do interpolation on the string
        var finalString = helpers.interpolate(str,data);
        callback(false,finalString);
      } else {
        callback('No template could be found');
      }
    });
  } else {
    callback('A valid template name was not specified');
  }
};

// Add the universal header and footer to a string, and pass provided data object to header and footer for interpolation
helpers.addUniversalTemplates = function(str,data,callback){
  str = typeof(str) == 'string' && str.length > 0 ? str : '';
  data = typeof(data) == 'object' && data !== null ? data : {};
  // Get the header
  helpers.getTemplate('_header',data,function(err,headerString){
    if(!err && headerString){
      // Get the footer
      helpers.getTemplate('_footer',data,function(err,footerString){
        if(!err && headerString){
          // Add them all together
          var fullString = headerString+str+footerString;
          callback(false,fullString);
        } else {
          callback('Could not find the footer template');
        }
      });
    } else {
      callback('Could not find the header template');
    }
  });
};

// Take a given string and data object, and find/replace all the keys within it
helpers.interpolate = function(str,data){
  str = typeof(str) == 'string' && str.length > 0 ? str : '';
  data = typeof(data) == 'object' && data !== null ? data : {};

  // Add the templateGlobals to the data object, prepending their key name with "global."
  for(var keyName in config.templateGlobals){
     if(config.templateGlobals.hasOwnProperty(keyName)){
       data['global.'+keyName] = config.templateGlobals[keyName]
     }
  }
  // For each key in the data object, insert its value into the string at the corresponding placeholder
  for(var key in data){
     if(data.hasOwnProperty(key) && typeof(data[key] == 'string')){
        var replace = data[key];
        var find = '{'+key+'}';
        str = str.replace(find,replace);
     }
  }
  return str;
};

// Get the contents of a static (public) asset
helpers.getStaticAsset = function(fileName,callback){
  fileName = typeof(fileName) == 'string' && fileName.length > 0 ? fileName : false;
  if(fileName){
    var publicDir = path.join(__dirname,'/../public/');
    fs.readFile(publicDir+fileName, function(err,data){
      if(!err && data){
        callback(false,data);
      } else {
        callback('No file could be found');
      }
    });
  } else {
    callback('A valid file name was not specified');
  }
};

helpers.htmlEmailInterpolator = (str, orderData) => {
    if (typeof (str) == 'string' && str.length > 0) {
        //looping through the order object
        for (var key in orderData) {
            if (orderData.hasOwnProperty(key)) {
                //if the property of the order object is an array --- order items --special interpolation--creating an html table.
                if (orderData[key] instanceof Array) {
                    var itemsArr = orderData[key];
                    //table sting which will conatain all the item details rows
                    var table = '';
                    //looping through the array of items
                    for (i = 0; i < itemsArr.length; i++) {
                        var itemObject = itemsArr[i];
                        //removing unwanted properties from the item object.
                        delete itemObject.mealId;
                        delete itemObject.description;

                        var columns = '';

                        //looping through itemObject properties and adding each property value in a column of the table
                        for (var key in itemObject) {
                            if (itemObject.hasOwnProperty(key)) {
                                //adding a column together columns
                                columns += `<td>${itemObject[key]}</td>\n`;
                            }
                        }
                        //adding the ccolumns to the row of te curent item
                        var tableRow = `<tr>${columns}</tr>`;
                        table += tableRow;
                    }
                    //interpolate receipt table section
                    str = str.replace('{items}', table);

                }
                //inteporate other orderData properties simply
                else {
                    var findItem = '{orderData.' + key + '}'
                    var replaceItem = orderData[key];
                    str = str.replace(findItem, replaceItem);
                }
            }
        };
        console.log("inside email template")
        return str;
    }
};




helpers.chargeCustomer = (cost, stripeToken, callback) => {
    //building the payload to be sent to stripe api
    console.log(cost)
    var payload = {
        description: 'Pizza Delivery',
        amount: cost*100,//converting to cents
        currency: 'usd',
        source: 'tok_visa' //@TODO to be changed to stripeToken
    }

    var stringPayload = querystring.stringify(payload);
    requestOptions = {
        'protocol': 'https:',
        'hostname': 'api.stripe.com',
        'path': '/v1/charges',
        'method': 'POST',
        'headers': {
            'Authorization': `Bearer ${config.stripe.secretKey}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(stringPayload)
        }
    }
    //making a request
    var req = https.request(requestOptions, res => {
            var status = res.statusCode;
            console.log("inside",status);
    /*if(status==200){
     callback(false);
     }else{
     callback(res);
     }*/
    res.on('data', data => {
        var parsedData = JSON.parse(data);

    if (parsedData.error) {
        callback(parsedData.error)
    } else {
        console.log("inside else part ");
        callback(false);
    }
})

});
    req.on('error', () => {
        debug('payment failed');
})
    //attaching the  string payload
    req.write(stringPayload);
    //sending the request
    req.end();
}



helpers.formatHtmlEmail = (orderData, templateName) => {


    var templateName = typeof (templateName) == 'string' && templateName.length > 0 ? templateName : false;
    var baseDir = path.join(__dirname,'/../templates/');

    console.log("base directory",baseDir);
    if (templateName) {
        //reading  template
        var str = fs.readFileSync(baseDir + templateName + '.html', 'utf8');
        //adding dynamic dat to the string
        var finalString = helpers.htmlEmailInterpolator(str, orderData);

        return finalString;
    } else {
        callback('templateName invalid');
    }
};



helpers.emailReceipt = (orderData, callback) => {

    var message = helpers.formatHtmlEmail(orderData, 'receipt');


    var payload = {
        'from': config.mailgun.from,
        'to': 'sathiyak@upspring.it',
        'subject': ' Pizza Delivery',
        'html': message
    }
    var stringPayload = querystring.stringify(payload);

    var requestOptions = {
        'protocol': 'https:',
        'hostname': 'api.mailgun.net',
        'method': 'POST',
        'path': `/v3/${config.mailgun.domainName}/messages`,
        'headers': {
            'Authorization': `Basic ${Buffer.from(`api:${config.mailgun.privateKey}`).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(stringPayload)
        }
    };
    //making a request
    var req = https.request(requestOptions, res => {
            var status = res.statusCode;
console.log("status code in request",res.statusCode);
    if (status == 200) {
        callback(false);

    } else {
        callback(res);
    }
});
    req.on('error', () => {
        console.log('Email failed to send');
})
    //attaching the  string payload
    req.write(stringPayload);
    //sending the request
    req.end();


}





// Export the module
module.exports = helpers;
