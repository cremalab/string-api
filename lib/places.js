const GooglePlaces = require('node-googleplaces');
const nock         = require('nock');
const places       = new GooglePlaces(process.env['GOOGLE_API_KEY'])
const locationStub = require('../test/routes/api/responses/gmaps')


function search(term) {
  return new Promise((resolve, reject) => {
    places.textSearch({query: term}, function(err, response) {
      if (err) {return reject(err)}
      return resolve(response.body.results)
    })
  })
}

function getDetails(placeid) {
  return new Promise((resolve, reject) => {
    // Can't get nock to intercept requests from node-googleplaces, so...
    if (process.env['NODE_ENV'] === 'test' ) {
      return resolve(locationStub.details.result)
    }
    places.details({placeid: placeid}, (err, response) => {
      if (response.body.status === 'INVALID_REQUEST') {
        return reject(`Google couldn't find a place with a placeid of ${placeid}`)
      }
      if (err) { return reject(err) }
      return resolve(response.body.result)
    })
  })
}

function autoComplete(term) {
  return new Promise((resolve, reject) => {
    places.autocomplete({input: term, types: "establishment"}, (err, response) => {
      if (err) { return reject(err) }
      return resolve(response.body.predictions)
    })
  })
}

module.exports = {
  autoComplete: autoComplete,
  search: search,
  getDetails: getDetails
}
