//var Patient = require('../models/patient')
var logger = require('winston')

function failure (res) {
  return function (err) {
    logger.warn('An error occured while starting game.', {err: err})
    res.status(401).json({err: err})
  }
}

exports.all = function (req, res) {
  var provider = req.user.provider
  var query = req.query.query
  if (!query || query.length < 5) {
    res.json([])
    return
  }  
}
