var https = require('https');
var querystring = require('querystring');

var config = require('./config');
var menus = require('./menus');
var mailgun = require('./mailgun');

var stripe = {};

stripe.payment = function(items, receipt_email, callback){


    var allItems = stripe.sumAllItems(items);
    var protocol = typeof(config.stripe.protocol) == 'string' && config.stripe.protocol.trim().toLowerCase() == 'https:' ? 'https:' : 'http:';
    var hostname = typeof(config.stripe.hostname) == 'string' && config.stripe.hostname.trim().length > 0 ? config.stripe.hostname.trim() : false;
    var charge = "?amount=" + allItems.amount + "&currency=" + config.stripe.currency + "&source=" + config.stripe.source + "&receipt_email=" + receipt_email + "&description=" + encodeURIComponent(allItems.description)
    console.log(hostname,protocol,config.stripe.secret_key);
    

   var payload = {
    'amount': allItems.amount,
    'currency': config.stripe.currency,
    'source': config.stripe.source
    }

    var payloadString = querystring.stringify(payload);

    // Request details
    var reqDetails = {
    'auth': config.stripe.secret_key,
    'hostname': 'api.stripe.com',
    'method': 'POST',
    'timeout': 5 * 1000,
    'path': '/v1/charges'
    };

    // Instantiate the request object
    var req = https.request(reqDetails, (res) => {
    var status = res.statusCode;

    console.log(res.statusCode);
    res.on('data', (d) => {

        if (res.statusCode == 200) {


            mailgun.send('sathiyak@upspring.it', 'Order Payment Details', allItems, function(error, mailData){
                if(!error){
                    console.log("success mail");
                    callback(false);
                    console.log("else");
                    callback(500, mailData);
                }
            });

        } else {
            console.log(res.statusCode);
            callback(true);
        }
    });
   

});
req.setHeader('Authorization', ('Bearer ' + config.stripe.secret_key));
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

stripe.sumAllItems = function(items){
    var total_amount = 0;
    var description = "";
    var selectedMenus = items.split(",");
    var itemsCount = 0;
    for(var i = 0; i < selectedMenus.length; i++){
        for(var j = 0; j < menus.length; j++){
            if(menus[j].id == selectedMenus[i]){
                itemsCount++;
                total_amount += menus[j].amount;
                description += " "+itemsCount+".<b>"+menus[j].title+"</b>&nbsp;"+menus[j].amount+" <br/> ";
            }
        }
    }
    console.log("Result==>>", {'amount': total_amount, 'description': description});
    return {'amount': total_amount, 'description': description};
}

module.exports = stripe;