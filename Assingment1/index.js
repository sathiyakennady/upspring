// Inbuild Node JS Dependencies
var http= require('http');
var https=require('https');
var url=require('url');
var fs=require('fs');
var StringDecoder=require('string_decoder').StringDecoder;

// Internal dependencies
var config=require('./lib/config');
var handlers=require('./lib/handlers');

/**
* Instantiate HTTP server 
* Configurations are read from config.js
**/

var httpserver = http.createServer(function(req,res){
  unifiedServer(req,res);
});
httpserver.listen(config.httpport,function(){
  console.log('The server is up and running now in ' + config.httpport );
});

/**
* Instantiate HTTPS server 
* Configurations are read from config.js
**/

var httpsServerOptions ={
  'key' : fs.readFileSync('./https/key.pem'),
  'cert' : fs.readFileSync('./https/cert.pem')
};
var httpsserver= https.createServer(httpsServerOptions,function(req,res){
   unifiedServer(req,res);
});
httpsserver.listen(config.httpsport,function(){
  console.log('The server is up and running now in ' + config.httpsport );
});


 
var unifiedServer=function(req,res){

  var parsedUrl=url.parse(req.url,true); 
  var path=parsedUrl.pathname; // contains the untrimmed path.
  var trimmedPath = path.replace(/^\/+|\/+$/g, '');
  var method=req.method.toLowerCase();
  var queryStringObj=parsedUrl.query;
  var decoder=new StringDecoder('utf-8'); 
  var buffer='';

  req.on('data', function(data){
    buffer+=decoder.write(data);
  });

  req.on('end',function(){
    buffer += decoder.end();
     
      // Checks if matching handler found or else route to notFound handler.
      var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

      // Construct the data object to send to the handler
      var data = {
        'trimmedPath' : trimmedPath,
        'qsParam' : queryStringObj,
        'method' : method,
        'headers' : req.headers,
        'payload' : buffer
      };

      // Route the request to the handler specified in the router
      chosenHandler(data,function(statusCode,payload){

         statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
         payload = typeof(payload) == 'object'? payload : {};
         var payloadString = JSON.stringify(payload);

         // Response object created and returned
         res.setHeader('Content-Type','application/json');
         res.writeHead(statusCode);
         res.end(payloadString);
       

      });

  });

};

// Router defined

var router = {
    '':handlers.index,
  'hello' : handlers.hello
};