const R = require('ramda')

module.exports.stringActions   = require('./stringActions')
module.exports.activityActions = require('./activityActions')
module.exports.userActions     = require('./userActions')

module.exports = R.mergeAll([
  exports.stringActions,
  exports.activityActions,
  exports.userActions
])
