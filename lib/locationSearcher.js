const keystone = require('keystone')
const Location = keystone.list('Location')
const Activity = keystone.list('Activity')
const Places   = require('./places')
const i18n     = require('../config/i18n')

const distanceInt = 16000 // approx 10 miles

function distanceQuery(coords, minDist, maxDistance) {
  return {
    $near: {
      $geometry: {
        type: 'Point', coordinates: [coords.longitude, coords.latitude]
      }, $maxDistance: maxDistance||distanceInt, $minDistance: minDist || 0
    }
  }
}

function locationSearch(params) {
  return findLocations(params).then((finalResults) => {
    // If no results from activities...
    if (finalResults.length == 0) {
      // Look for Locations where primaryCategory is activity_type
      return Promise.reject(i18n.t('errors.no_locations', {
        activity_type: params.activity_type
      }))
    }
    let rand = Math.floor(Math.random() * finalResults.length)
    return finalResults[rand]
  })

}

function findOne(params) {
  return locationSearch(params).then((result) => {
    return Places.getDetails(result.placeId).then((details) => {
      return Object.assign(details, {'_id': String(result._id)})
    })
  }).then((details) => {
    return details
  })
}

// Query activities that have happened nearby
function nearbyActivities(params, iteration) {

  console.log(`nearbyActivities: ${iteration+1}`)
  const coords = (params.userLocation && params.userLocation.coords)
  let query = Activity.model.where({category: params.activity_type})
    .where('location').nin(params.rejected)

  // Get nearby activities if coordinates have been passed
  if (coords) {
    query = query.where({
      'geo': distanceQuery(coords, iteration*distanceInt, iteration*(distanceInt+1))
    })
  }

  return query.sort({completedCount: -1, recommendationScore: -1}).limit(10)
}

// Query nearby Locations
function nearbyLocations(params) {
  const coords = (params.userLocation && params.userLocation.coords)
  let query = Location.model.where({primaryCategory: params.activity_type})
  .where('_id').nin(params.rejected)
  if (coords) {
    query.where({
      'info.geo': distanceQuery(coords)
    })
  }
  return query.exec().then((loc) => {
    return Promise.resolve(loc)
  })
}

// Find first location results using nearbyLocations and nearbyActivities
function findLocations(params) {
  return new Promise((resolve) => {
    return [
      // Try nearbyActivities search 3 times with expanding radius, then try nearbyLocations
      nearbyActivities, nearbyActivities, nearbyActivities, nearbyLocations, Promise.resolve
    ].reduce((mem, func, i) => {
      return mem.then((results) => {
        // If found results, return them until reduce is complete
        if ((results && results.length > 0)) {
          return Promise.resolve(results)
        }
        // continue queries
        return func(params, i)
      })
    }, Promise.resolve()).then(resolve)
  })
}


module.exports = {
  search: locationSearch,
  findOne: findOne
}
