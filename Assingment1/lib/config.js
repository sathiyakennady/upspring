var environments={}

// default environment will be set to staging configurations

environments.staging={
	'httpport' : 3000,
	'httpsport' : 3001,
	'envname' : 'staging'
};

environments.production={
	'httpport' : 5000,
	'httpsport' : 5001,
	'envname' : 'production'
};


// Checks the current environment , if any valid value is passed as NODE_ENV while starting the
// application the configuration of the specific environments are read. By default value of staging will
// be used.

var currentEnv=typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';
var environmentExp = typeof(environments[currentEnv])=='object' ? environments[currentEnv] : environments.staging;

module.exports=environmentExp;