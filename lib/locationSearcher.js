const keystone = require('keystone')
const Location = keystone.list('Location')
const Activity = keystone.list('Activity')
const Places   = require('./places')
const i18n     = require('../config/i18n')

const locationSearch = function(params) {
  console.log('loc search params', params)
  return Activity.model.where({category: params.activity_type})
    .where('location').nin(params.rejected)
    .sort({completedCount: -1, recommendationScore: -1})
    .limit(10)
    .exec()
  .then((results) => {
    let rand
    // If no results from activities...
    if (results.length == 0) {
      // Look for Locations where primaryCategory is activity_type
      console.log('ACTIVITY TYPE: ', params.activity_type)
      return Location.model.where({primaryCategory: params.activity_type})
      .where('_id').nin(params.rejected)
      .exec().then((results) => {
        console.log('LOCATION RESULTS: ', results, results.length)
        // if no locations, give up
        console.log(results.length);
        if (results.length < 1) {
          return Promise.reject(i18n.t('errors.no_locations', {
            activity_type: params.activity_type
          }))
        }
        // Otherwise pick a random location from the results
        rand = Math.floor(Math.random() * results.length)
        console.log('got a result!');
        return Location.model.where({_id: results[rand]}).exec()
      })
    }
    rand = Math.floor(Math.random() * results.length)
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
