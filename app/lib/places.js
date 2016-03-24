const GooglePlaces = require('node-googleplaces');

const places = new GooglePlaces(process.env['GOOGLE_API_KEY']);


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
    places.details({placeid: placeid}, (err, response) => {
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
