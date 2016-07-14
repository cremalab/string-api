const keystone = require('keystone')
const Location = keystone.list('Location')
const Places   = require('./places')

const locationSearch = function(params) {
  // Do some thing meaningful
  return Location.model.where({})
}

const findOne = function(params) {
  return locationSearch(params).then((results) => {
    return Places.getDetails(results[0])
  }).then((details) => {
    console.log(details);
    return details
  })
}


module.exports = {
  search: locationSearch,
  findOne: findOne
}
