const keystone = require('keystone')
const Location = keystone.list('Location')
const Places   = require('./places')

const locationSearch = function(params) {
  // Do some thing meaningful
  return new Promise((resolve, reject) => {
    Location.model.findRandom({}, {}, {limit: 1}, (err, results) => {
      if (err) reject(err)
      resolve(results)
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
