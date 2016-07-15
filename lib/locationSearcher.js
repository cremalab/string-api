const keystone = require('keystone')
const Location = keystone.list('Location')
const Activity = keystone.list('Activity')
const Places   = require('./places')
const i18n     = require('../config/i18n')

const locationSearch = function(params) {
  // Do some thing meaningful
  return new Promise((resolve, reject) => {

    Activity.model.findRandom({
      category: params.activity_type
    }, {}, {
      sort: { completedCount: -1 },
      limit: 10,
    }, (err, results) => {
      if (err) reject(err)
      if (results.length == 0) {
        reject(i18n.t('errors.no_activities', {
          activity_type: params.activity_type
        }))
      }
      return Location.model.where({_id: results[0].location}).exec()
        .then((l) => resolve(l))
    })

  })
}

const findOne = function(params) {
  return locationSearch(params).then((results) => {
    if (results.length == 0) { return Promise.reject('No places found')}
    return Places.getDetails(results[0].placeId)
  }).then((details) => {
    return details
  })
}


module.exports = {
  search: locationSearch,
  findOne: findOne
}
