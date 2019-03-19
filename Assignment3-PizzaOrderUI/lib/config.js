var environments={};
environments.staging={
    'httpPort':3000,
    'httpsPort':3001,
    'envName':'staging',
    'hashingSecret' : 'thisIsASecret',
    'stripe':{
        'secretKey':'sk_test_WMWPRkuDOPMuzEvL2D1I6KRL',
        'publishableKey':'pk_test_asUyqxjr0Kf7HeffNxJYTC0g'
    },
    'mailGun':{
        'apiKey':'847ce9ba12a73d1b3e1d1d4b46d50c10-060550c6-abcc0144',
        'baseUrl':'https://api.mailgun.net/v3/mg.awesome-dev.com',
        'sandboxDomain':'sandbox2cf47240ab784f78a97a66b5c702ef4b.mailgun.org',
        'defaultEmail':'hi@sandbox2cf47240ab784f78a97a66b5c702ef4b.mailgun.org'
    },
    'globals':{
		'companyName':'Karumbairam, Inc',
		'chiefEngineer':'Dellan Muchengapdare',
		'appName':'Karumbairam Foods',
		'baseUrl':'http://localhost:3000/',
		'yearCreated':'2019'
	}
};



var  currentEnvironment=typeof(process.env.NODE_ENV)=='string' ? process.env.NODE_ENV.toLowerCase() : '';

 var environmentTOExport =typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] :environments.staging;

 module.exports = environmentTOExport;