/*
 * Create and export configuration variables
 *
 */

// Container for all environments
var environments = {};

// Staging (default) environment
environments.staging = {
  'httpPort' : 3000,
  'httpsPort' : 3001,
  'envName' : 'staging',
  'hashingSecret' : 'thisIsASecret',
  'maxChecks' : 5,
  'stripe':{
      'secretKey':'sk_test_TzW2y0JoNOGNCeAad7hj1oRP',
      'publishableKey':'pk_test_Ds5zvFmwfC9nAJ4Lejd6EtUF'
    },
    'mailgun': {
        'domainName': 'sandboxXXXXXXXXXXXXXXXXXXX.mailgun.org',
        'host': 'api.mailgun.net',
       ' authUsername': 'api',
        'privateKey': 'ffXXXXXXXXXXXXXXXX-2416cf28-34403f24',
        'from': 'sathiya@sandboxXXXXXXXXXXXXXXXXXXX.mailgun.org',

    },
  'templateGlobals' : {
    'appName' : 'Karumbairam Foods',
    'companyName' : 'UpspringInfotech Pvt lt.',
    'yearCreated' : '2019',
    'baseUrl' : 'http://localhost:3000/'
  }
};


// Determine which environment was passed as a command-line argument
var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current environment is one of the environments above, if not default to staging
var environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

// Export the module
module.exports = environmentToExport;
