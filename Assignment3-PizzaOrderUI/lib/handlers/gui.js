var util = require('util');
var debug = util.debuglog('gui');
var templating = require('../template');
var _data = require('../data');



var handlers = {};
handlers.account = {};
handlers.session = {}
handlers.meals = {};
handlers.orders = {};


handlers.notFound=function(data,callback)
{
    callback(404);
}

handlers.home = (data,callback)=>{
	//only accept get method
	if(data.method == 'get'){
		//specific html data for this page which is to be intepolated into the template
		var data = {
			'head.title':'Home'
		}
		//get the tamplate
		templating.getTemplate('index',data,(err,str)=>{
			if(!err && str ){
				callback(200,str,'html');
			}
		})
	}
}



handlers.public = (data,callback)=>{
	var trimmedPath = typeof(data.trimmedPath)=='string' && data.trimmedPath.trim().length > 0 ? data.trimmedPath.trim():false;
	if(trimmedPath){
		//remove the public/ from the trimmedPath
		filePath  = trimmedPath.replace('public/','');
		//send to the get static file function
		templating.getStaticFile(filePath,(err,str,contentType)=>{
			if(!err && str && str.length > 0 ){
				callback(200,str,contentType);
			}else{
				callback(404);
			}
		});
	}
}



handlers.account.create=function(data,callback)
{
  if(data.method=='get')
  {
    var data={
      'head.title':'signUp',
      'body.title':'Create an Account'
    }
    templating.getTemplate('accountCreate',data,function(err,str)
    {
      if(!err && str)
      {
        callback(200,str,'html')
      }
    });
  }
}

handlers.account.delete = (data,callback)=>{
    //only accept get method
    if(data.method == 'get'){
        //specific html data for this page which is to be intepolated into the template
        var data = {
            'head.title':'Delete Account',
            'body.title':'Delete Account'
        }
        //get the tamplate
        templating.getTemplate('accountDelete',data,(err,str)=>{
            if(!err && str ){
            callback(200,str,'html');
        }
    })
    }
};

handlers.account.deleted = (data,callback) => {
    //only accept get method
    if(data.method == 'get'){
        //specific html data for this page which is to be intepolated into the template
        var data = {
            'head.title':'Account deleted',
            'body.title':'Account deleted'
        }
        //get the tamplate
        templating.getTemplate('accountDeleted',data,(err,str)=>{
            if(!err && str ){
            callback(200,str,'html');
        }
    })
    }





};





handlers.session.create=function(data,callback)
{
  if(data.method == 'get')
  {
    var data={
      'head.title':'login',
      'body.title':'Food Order'
    }
    templating.getTemplate('sessionCreate',data,function(err,str){
        if(!err && str)
        { callback(200,str,"html");}
    })
  }
  else {
    callback(400)
  }

}


handlers.session.delete = (data,callback)=>{
    if(data.method=='get'){
        //Data to be interporated into the html template
        var data = {
            'head.title':'loggged out',
            'body.title':'Loggout out'

        }
        templating.getTemplate('sessionDeleted',data,(err,str)=>{
            if(!err && str ){
            callback(200,str,'html');
        }
    })
    }else{
        callback(status);
    }


};


handlers.meals.list=function(data,callback){

console.log("inside meal list");

    if(data.method=='get')
    {
      _data.list('meals',function(err,mealList)
    {
        if(!err && mealList)
        {


          var snippet=' ';
          for(i=0;i<mealList.length;i++)
          {

              var meal=mealList[i];
              var card=templating.getSnippet('mealCard');

              for(var key in meal ){
						  if(meal.hasOwnProperty(key)){
							  var find = '{meal.'+key+'}';
							  var replace = meal[key];
							  card = card.replace(find,replace);
						   }
			  }
              snippet+=card;

          }
          var data = {
          			'head.title':'Menu',
          			'body.title':'Fill up your cart',
          			'snippet':snippet
          		}

              templating.getTemplate('mealList',data,(err,datas)=>{
      			if(!err &&datas){
      				console.log("inside meallist UI");
      				callback(200,datas,'html');
      			}else{
      				callback(500,{'Error':'No meals'});
      			}
      		});


        }


    });
    }
}

handlers.meals.create=function(data,callback){
  
  var userId =  typeof (data.queryStringObject.userId) == 'string' && data.queryStringObject.userId.trim().length == 20 ? data.queryStringObject.userId.trim() : false;
	if(userId && data.method == 'get'){
		//Lookup the user
		_data.read('users',userId,(err,userData) => {
			if(!err && userData ){
				//continue id user is Admin
				if( typeof (userData.isAdmin) && userData.isAdmin ){
								//Data to be interporated into the html template
				var data = {
			'head.title':'Admin',
			'body.title':'Admin - add a meal'

		}
			templating.getTemplate('createMeal',data,(err,str)=>{
			if(!err && str ){
				callback(200,str,'html');
			}
		})
	}else{
									//Data to be interporated into the html template
				var data = {
			'head.title':'Not Allowed',
			'body.title':'You are not Authorised'

		}
			templating.getTemplate('notAllowed',data,(err,str)=>{
			if(!err && str ){
				callback(200,str,'html');
			}
		});
		}
	}else{
		callback(400);
	}
})
}else{
	callback(400);
}
}

handlers.meals.add = (data,callback) => {
    //Required Data
    var userId =  typeof (data.queryStringObject.userId) == 'string' && data.queryStringObject.userId.trim().length == 20 ? data.queryStringObject.userId.trim() : false;
    if(userId && data.method == 'get'){
        //Lookup the user
        _data.read('users',userId,(err,userData) => {
            if(!err && userData ){
            //continue id user is Admin
            if( typeof (userData.isAdmin) && userData.isAdmin ){
                //Data to be interporated into the html template
                var data = {
                    'head.title':'Admin',
                    'body.title':'Admin - add a meal'

                }
                templating.getTemplate('createMeal',data,(err,str)=>{
                    if(!err && str ){
                    callback(200,str,'html');
                }
            })
            }else{
                //Data to be interporated into the html template
                var data = {
                    'head.title':'Not Allowed',
                    'body.title':'You are not Authorised'

                }
                templating.getTemplate('notAllowed',data,(err,str)=>{
                    if(!err && str ){
                    callback(200,str,'html');
                }
            });
            }
        }else{
            callback(400);
        }
    })
    }else{
        callback(400);
    }
};





handlers.orders.detail=function(data,callback) {

    var orderId = typeof (data.queryStringObject.orderId) == 'string' && data.queryStringObject.orderId.trim().length == 20 ? data.queryStringObject.orderId.trim() : false;
    if( data.method == 'get' && orderId ){
        //reading the order from teh FS
        _data.read('orders',orderId,(err,orderData) => {
            if(!err && orderData ){
            var data = {
                'head.title':'checkout',
                'body.title':'Empty your pockets',
                'userEmail':orderData.userEmail,
                'subtotal':orderData.subtotal,
                'deliveryCost':orderData.deliveryCost,
                'total':orderData.total,
                'id':orderData.id
            }
            //grabbing the template and intepolating the data
            templating.getTemplate('orderDetails',data,(err,str)=>{
                if(!err && str ){
                callback(200,str,'html');
            }
        })
        }else{
            callback(500,{'Error':'Could not find order'});
        }
    });
    }else{
        callback(400,{'Error':'Missing required fields or method is not allowed'});
    }

}


handlers.orders.thankYou = (data,callback) =>{
    //only accept get method
    if(data.method == 'get'){
        //specific html data for this page which is to be intepolated into the template
        var data = {
            'head.title':'checkout complete',
            'body.title':'Delivery will arrive soon!'
        }
        //get the tamplate
        templating.getTemplate('ordersThankYou',data,(err,str)=>{
            if(!err && str ){
            callback(200,str,'html');
        }
    })
    }

};


module.exports=handlers;
