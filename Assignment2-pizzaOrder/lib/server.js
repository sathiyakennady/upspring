var http= require('http');
var https=require('https');
var url=require('url');
var fs=require('fs');
var StringDecoder=require('string_decoder').StringDecoder;


var config=require('./config');
var handlers=require('./handlers');
var helpers=require('./helpers');
var server={};


server.httpserver = http.createServer(function(req,res){
  console.log('http server');
    server.unifiedServer(req,res);
});


server.httpsServerOptions ={
  'key' : fs.readFileSync('./https/key.pem'),
  'cert' : fs.readFileSync('./https/cert.pem')
};

server. httpsserver= https.createServer(server.httpsServerOptions,function(req,res){
   server.unifiedServer(req,res);
});



 
server.unifiedServer=function(req,res){

    console.log(2);
    var parseUrl=url.parse(req.url,true);
    var path =parseUrl.pathname;
    var trimmedPath=path.replace(/^\/+|\/+$/g,'');
    var queryStringObject =parseUrl.query;
    var method=req.method.toLowerCase();
    var headers=req.headers;
    
    var decoder = new StringDecoder('utf-8');
    var buffer="";
    
    
    
    req.on('data', function(data) {
        console.log("data",data);
        buffer += decoder.write(data);
    });
    
    req.on('end',function(){
    
        
        buffer += decoder.end();
        var chosenHandler=typeof(server.router[trimmedPath])!== 'undefined' ? server.router[trimmedPath] : handlers.notFound;
        
        chosenHandler = trimmedPath.indexOf('public/') > -1 ? handlers.public : chosenHandler;
        
        var data ={
            'trimmedPath' : trimmedPath,
            'queryStringObject' :queryStringObject,
            'method':method,
            'headers': headers,
            'payload':helpers.parseJSONToObject(buffer)
        };
    
        chosenHandler(data,function(statusCode,payload,contentType){
    
    
            contentType = typeof(contentType) == 'string' ? contentType : 'json';
    
            statusCode =typeof(statusCode) == 'number' ? statusCode :200;
    
            var payloadString = '';
            if(contentType == 'json'){
              res.setHeader('Content-Type', 'application/json');
              payload = typeof(payload) == 'object'? payload : {};
              payloadString = JSON.stringify(payload);
            }
    
            if(contentType == 'html'){
              res.setHeader('Content-Type', 'text/html');
              payloadString = typeof(payload) == 'string'? payload : '';
            }
    
            if(contentType == 'plain'){
                res.setHeader('Content-Type', 'text/plain');
                payloadString = typeof(payload) !== 'undefined' ? payload : '';
              }
     
              if(contentType == 'css'){
                res.setHeader('Content-Type', 'text/css');
                payloadString = typeof(payload) !== 'undefined' ? payload : '';
              }
     
              if(contentType == 'png'){
                res.setHeader('Content-Type', 'image/png');
                payloadString = typeof(payload) !== 'undefined' ? payload : '';
              }
     
              if(contentType == 'jpg'){
                res.setHeader('Content-Type', 'image/jpeg');
                payloadString = typeof(payload) !== 'undefined' ? payload : '';
              }
     
    
           // res.setHeader("Content-Type","application/json");
            res.writeHead(statusCode);
            res.end(payloadString);
    
    
        });
    });
};

// Router defined
server. router = {
    '':handlers.index,
  'users' : handlers.users,
  'menus':handlers.menus,
  'login':handlers.login,
  'logout':handlers.logout,
  'order': handlers.order
};


server.init=function()
{

    server.httpserver.listen(config.httpPort,function(){
        console.log('The server is up and running now in ' + config.httpPort );
    });
      
    server.httpsserver.listen(config.httpsPort,function(){
          console.log('The server is up and running now in ' + config.httpsPort );
     });
        
}


module.exports=server;