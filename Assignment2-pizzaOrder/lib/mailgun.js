var https = require('https');
var queryString = require('querystring');

var StringDecoder = require('string_decoder').StringDecoder;
var config = require('./config');

var mailgun = {};

mailgun.send = function(to, subject, text, callback){

    var protocol = typeof(config.mailgun.protocol) == 'string' && config.mailgun.protocol.trim().toLowerCase() == 'https' ? 'https:' : 'http:';
    var hostname = typeof(config.mailgun.hostname) == 'string' && config.mailgun.hostname.trim().length > 0 ? config.mailgun.hostname.trim() : false;
    var basePath = typeof(config.mailgun.path) == 'string' && config.mailgun.path.trim().length > 0 ? config.mailgun.path.trim() : false;
 //   var token = typeof(config.mailgun.token) == 'string' && config.mailgun.token.trim().length > 0 ? config.mailgun.token.trim() : false;
    var from = typeof(config.mailgun.from) == 'string' && config.mailgun.from.trim().length > 0 ? config.mailgun.from.trim() : false;
    

var payload = {
    'from': from,
    'to': to,
    'subject': 'Food delivery order: ',
    'text': text
};
console.log(payload);
var payloadString = queryString.stringify(payload);

// Request details
var reqDetails = {
    'auth': 'api:'+ config.mailgun.token,
    'hostname': 'api.mailgun.net',
    'method': 'POST',
    'timeout': 5 * 1000,
    'path': '/v3/'+ 'sandboxfc28677eefb94307a3418c096362d487.mailgun.org'+'/messages'
};
console.log(reqDetails)
// Instantiate the request object
var req = https.request(reqDetails, (res) => {
    var decoder = new StringDecoder('utf-8');
    var buffer = ''
    res.on('data', (d) => {             
        console.log('on-data');   
        buffer += decoder.write(d);
        console.log("mailgun res",res.statusCode);
        if (res.statusCode == 200) {
            callback(false);//false
        } else {
            callback(true);//true
        }
    });
    res.on('end', () => {
        console.log('end-data');
        buffer += decoder.end();
    }); 

});

//req.setHeader('Authorization', ('Bearer ' + config.mailgun_api_key));
req.setHeader('Content-Type', 'application/x-www-form-urlencoded');
req.setHeader('Content-Length', Buffer.byteLength(payloadString));

// Bind to the error event so it doesn't get thrown
req.on('error', function (e) {
    callback(e);
});

// Add the payload
req.write(payloadString);

// End the request

req.end();
    

}

module.exports = mailgun;