'use strict'
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
    if (typeof placeid === 'object') {
      if (!placeid.info.geo) {
        saveDetailsToModel(placeid).then(resolve)
      } else {
        resolve(placeid)
      }
    } else {
      fetchFromGoogle(placeid).then(resolve)
    }
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

function fetchFromGoogle(placeid) {
  return new Promise((resolve, reject) => {
    places.details({placeid: placeid}, (err, response) => {
      if (err) {reject(err)}
      if (response.body.status === 'INVALID_REQUEST') {
        return reject(`Google couldn't find a place with a placeid of ${placeid}`)
      }
      let data = response.body.result

      const address = data.address_components.reduce( (mem, c) => {
        mem[c.types[0]] = c.long_name
        return mem
      }, {})

      const formattedInfo = {
        geo: [data.geometry.location.lng, data.geometry.location.lat],
        name: data.name,
        number: address.street_number,
        street1: address.route,
        suburb: address.locality,
        state: address.administrative_area_level_1,
        postcode: address.postal_code,
        country: address.country
      }
      data.info = formattedInfo

      if (err) { return reject(err) }
      return resolve(data)
    })
  })
}

function saveDetailsToModel(location) {
  return new Promise((resolve, reject) => {
    fetchFromGoogle(location.placeId).then((data) => {
      location.info = data.info
      location.save((err, location) => {
        if (err) { return reject(err) }
        console.log(`Location info saved for ${location.name}`);
        resolve(location.info)
      })
    })
  })
}
