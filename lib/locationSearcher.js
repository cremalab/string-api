const keystone = require('keystone')
const Location = keystone.list('Location')
const Activity = keystone.list('Activity')
const Places   = require('./places')
const i18n     = require('../config/i18n')

const locationSearch = function(params) {
  return Activity.model.where({category: params.activity_type})
    .where('location').nin(params.rejected)
    .sort({completedCount: -1})
    .limit(10)
    .exec()
  .then((results) => {
    if (results.length == 0) {
      return Promise.reject(i18n.t('errors.no_locations', {
        activity_type: params.activity_type
      }))
    }
    const rand = Math.floor(Math.random() * results.length)
    return Location.model.where({_id: results[rand].location}).exec()
  })
}

const findOne = function(params) {
  return locationSearch(params).then((results) => {
    if (results.length == 0) { return Promise.reject('No places found')}
    return Places.getDetails(results[0].placeId).then((details) => {
      return Object.assign(details, {'_id': String(results[0]._id)})
    })
  }).then((details) => {
    return details
  })
}


module.exports = {
  search: locationSearch,
  findOne: findOne
}
