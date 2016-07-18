const keystone = require('keystone')
const Activity = keystone.list('Activity')
const i18n     = require('../config/i18n')

const querySize = 30

const suggest = function(params) {
  if (!params.activity_type) throw new Error('activity_type required')
  if (!params.location) throw new Error('location required')

  return Activity.model.where({category: params.activity_type})
    .where({location: params.location})
    .sort({completedCount: -1})
    .limit(querySize)
    .exec()
  .then((results) => {
    if (results.length == 0) {
      return Promise.reject(i18n.t('errors.no_activities', {
        activity_type: params.activity_type
      }))
    }
    const rand = Math.floor(Math.random() * results.length)
    return results[rand]
  })
}


module.exports = {
  suggest: suggest
}
