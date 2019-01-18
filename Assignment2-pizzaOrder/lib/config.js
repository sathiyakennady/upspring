var environments={};
environments.staging={
    'httpPort':3000,
    'httpsPort':3001,
    'envName':'staging',
    'hashingSecret' : 'thisIsASecret',
    'stripe': {
        'protocol': 'https:',
        'hostname': 'api.stripe.com',
        'basePath': '/v1/charges/',
        'secret_key': 'sk_test_TzW2y0JoNOGNCeAad7hj1oRP',
        'currency': 'USD',
        'source': 'tok_visa'
    },
    'mailgun': {
        'protocol': 'https',
        'port': 443,
        'hostname': 'api.mailgun.net',
        'path': '/v3/',
       'token': '7bc8de71664110722c01839eb78034e7-3939b93a-285936f0',
        'from': 'Mailgun Sandbox <postmaster@sandboxfc28677eefb94307a3418c096362d487.mailgun.org>',
        'to': 'sathiya <sathiyak@upspring.it>'
    }
};

environments.production={
    
    'httpPort':5000,
    'httpsPort':5001,
    'envName':'production',
   
};

var  currentEnvironment=typeof(process.env.NODE_ENV)=='string' ? process.env.NODE_ENV.toLowerCase() : '';

 var environmentTOExport =typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] :environments.staging;

 module.exports = environmentTOExport;