const keystone = require('keystone')
const Location = keystone.list('Location')
const Activity = keystone.list('Activity')
const Places   = require('./places')
const i18n     = require('../config/i18n')

const locationSearch = function(params) {
  return Activity.model.where({category: params.activity_type})
    .sort({completedCount: -1})
    .limit(10)
    .exec()
  .then((results) => {
    if (results.length == 0) {
      return Promise.reject(i18n.t('errors.no_activities', {
        activity_type: params.activity_type
      }))
    }
    const rand = Math.floor(Math.random() * results.length)
    console.log(rand);
    return Location.model.where({_id: results[rand].location}).exec()
  })
}

const findOne = function(params) {
  console.log('FIND ONE');
  return locationSearch(params).then((results) => {
    console.log('DID SEARCH');
    if (results.length == 0) { return Promise.reject('No places found')}
    return Places.getDetails(results[0].placeId).then((details) => {
      return Object.assign(details, {'_id': results[0]._id})
    })
  }).then((details) => {
    console.log('DEATILS!');
    console.log(details);
    return details
  })
}


module.exports = {
  search: locationSearch,
  findOne: findOne
}
