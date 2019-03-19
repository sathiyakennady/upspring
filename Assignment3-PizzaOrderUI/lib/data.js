var fs = require('fs');
var path = require('path')
var helpers = require('./helpers');
var util = require('util');
var debug = util.debuglog('data');


lib = {};

lib.baseDir = path.join(__dirname,'/./../.data/');

lib.create = function(dir,file,data,callback){
  fs.open(lib.baseDir+dir+'/'+file+'.json', 'wx', function(err, fileDescriptor){
    if(!err && fileDescriptor){

      var stringData = JSON.stringify(data);
      fs.writeFile(fileDescriptor, stringData,function(err){
        if(!err){
          fs.close(fileDescriptor,function(err){
            if(!err){
              callback(false);
            } else {
              callback('Error closing new file');
            }
          });
        } else {
          callback('Error writing to new file');
        }
      });
    } else {
      callback('Could not create new file, it may already exist');
    }
  });

};



lib.read = function(dir,file,callback){
    fs.readFile(lib.baseDir+dir+'/'+file+'.json', 'utf8', function(err,data){
        if(!err && data){
            var parsedData = helpers.parseJson(data);
            callback(false,parsedData);
        } else {
            callback(err,data);
        }
    });
};


lib.update =function(dir,filename,data,callback){

	fs.open(lib.baseDir+dir+'/'+filename+'.json','r+',function(err,fileDescriptor){
	if(!err && fileDescriptor){
		//truncate contents of the file
		fs.ftruncate(fileDescriptor,function(err){
			if(!err){
				//stringify the new data
				var stringData = JSON.stringify(data);
				//writing the new data
				fs.writeFile(fileDescriptor,stringData,function(err){
					if(!err){
						//closing the file
						fs.close(fileDescriptor,function(err){
							if(!err){
								callback(false);
							}else{
								callback('Failed to close the  file');
							}
						});
					}else{
						callback('Failed to write new data to file');
					}
				})
			}else{
				callback('Failed to truncate the file');
			}
		});
	}else{
		callback('failed to open file for updating');
	}
	});
};

lib.delete = function(dir,file,callback){


  fs.unlink(lib.baseDir+dir+'/'+file+'.json', function(err){
    callback(err);
  });

};

lib.list = function(dir,callback){

	fs.readdir(lib.baseDir+dir,function(err,fileList){
		if(!err && fileList){

			var dataList = [];
			for(i=0;i<fileList.length;i++){
				var file = fileList[i]
				var content = fs.readFileSync(lib.baseDir+dir+'/'+file,'utf8');

				parsedContent = JSON.parse(content);
				dataList.push(parsedContent);
			}
			callback(false,dataList);
		}else{
			callback('Failed to get the file list');
		}

	})
};

lib.listDocs =  function(dir,callback){
	fs.readdir(lib.baseDir+dir,function(err,docsList){
		if(!err && docsList){
			callback(false,docsList);
		}else{
			callback("failed to read the collection");
		}
	})
}

module.exports = lib;
