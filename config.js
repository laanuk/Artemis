var env = process.env.NODE_ENV || 'development'
var logger = require('winston')
logger.info('The current environment is %s', env)

var loggingLevel = 'debug'

logger.remove(logger.transports.Console)
logger.add(logger.transports.Console, {
  timestamp: true,
  level: loggingLevel
})

function exportVar (name, devValue, prodValue) {
  if (env === 'production') {
    exports[name] = prodValue
  } else if (env === 'development') {
    exports[name] = devValue
  } else if (env === 'test') {
    exports[name] = devValue
  }

  if (exports[name] === undefined) {
    logger.error('Please configure ' + name + ' before running the server!')
    throw new Error('Please configure ' + name + ' before running the server!')
  }
}

exportVar('WEB_PORT', process.env.PORT || 8000, 8000)
exportVar('WEB_DOMAIN', 'http://127.0.0.1:8000', 'https://secure.memorahealth.com')

exportVar('MONGO_USERNAME', 'laanuk', process.env.MONGO_USERNAME)
exportVar('MONGO_PASSWORD', 'kanchan8', process.env.MONGO_PASSWORD)
exportVar('MONGO_HOST', 'ds051543.mongolab.com:51543', process.env.MONGO_HOST)
exportVar('MONGO_DATABASE', 'artemis', process.env.MONGO_DATABASE)
