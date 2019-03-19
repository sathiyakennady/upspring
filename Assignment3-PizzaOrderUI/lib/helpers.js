var crypto = require('crypto');
var config = require('./config');
var https = require('https');
var querystring = require('querystring');
var fs = require('fs');
var path = require('path');
var util = require('util');
var debug = util.debuglog('helpers');


var helpers = {};

helpers.parseJson = function(str) {
	if (typeof (str) == 'string' && str.length > 0) {
		try {
			return JSON.parse(str);
		} catch (e) {
			debug(e, 'failed to parse json');
			return {};
		}
	} else {
		return {};
	}
};


helpers.validateEmail=function(email)
{
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
};


helpers.createRandomString=function(strLength)
{
	strLength = typeof (strLength) == 'number' && strLength > 0 ? strLength : false;
		if (strLength) {
			var possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';
			var str = '';
			for (i = 1; i <= strLength; i++) {
				var randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
				str += randomCharacter;
			}
			return str;
		} else {
			return false;
		}

};



helpers.hash=function(str)
{
	if (typeof (str) == 'string' && str.length > 0) {
		var hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
		return hash;
	} else {
		return false;
	}
}



helpers.chargeCustomer = function(orderData, stripeToken, callback)  {

    var payload = {
        description: 'Pizza Delivery',
        amount: orderData.total*100,//converting to cents
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
    var req = https.request(requestOptions, function(res) {
            var status = res.statusCode;

    res.on('data', function(data ) {
        var parsedData = JSON.parse(data);
    if (parsedData.error) {
        callback(parsedData.error)
    } else {
        callback(false);
    }
})

});
    req.on('error', function()  {
        debug('payment failed');
})
    //attaching the  string payload
    req.write(stringPayload);
    //sending the request
    req.end();
}


helpers.emailReceipt = function(orderData, userData, callback) {
    var message = helpers.formatHtmlEmail(orderData, 'receipt');

    var payload = {
        'from': config.mailGun.defaultEmail,
        'to': userData.email,
        'subject': 'Receipt - Pizza Delivery',
        'html': message
    }
    var stringPayload = querystring.stringify(payload);

    var requestOptions = {
        'protocol': 'https:',
        'hostname': 'api.mailgun.net',
        'method': 'POST',
        'path': `/v3/${config.mailGun.sandboxDomain}/messages`,
        'headers': {
            'Authorization': `Basic ${Buffer.from(`api:${config.mailGun.apiKey}`).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(stringPayload)
        }
    };
    //making a request
    var req = https.request(requestOptions, function(res){
            var status = res.statusCode;
    if (status == 200) {
        callback(false);
        debug(status);
    } else {
        callback(res);
    }
});
    req.on('error', function()  {
        debug('Email failed to send');
})
    //attaching the  string payload
    req.write(stringPayload);
    //sending the request
    req.end();


}


helpers.formatHtmlEmail = function(orderData, templateName){
    var templateName = typeof (templateName) == 'string' && templateName.length > 0 ? templateName : false;
    var baseDir = path.join(__dirname, '/./../template/');
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

//interpolation of a str html
helpers.htmlEmailInterpolator = function(str, orderData) {
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
        return str;
    }
};

module.exports = helpers;
