'use strict'

const Activity = require('../../app/models/activity').Activity
const List     = require('../../app/models/list').List
const Location = require('../../app/models/location').Location

exports.removeActivities = function() {
  return new Promise((resolve, reject) => {
    Activity.remove({}, (err) => {
      if (err) { return reject(err) }
      return resolve()
    })
  })
}

exports.removeLists = function() {
  return new Promise((resolve, reject) => {
    List.remove({}, (err) => {
      if (err) { return reject(err) }
      return resolve()
    })
  })
}

exports.removeLocations = function() {
  return new Promise((resolve, reject) => {
    Location.remove({}, (err) => {
      if (err) { return reject(err) }
      return resolve()
    })
  })
}

exports.stubList = function() {
  let list = new List({description: '#art #walk in the #crossroads'});
  return new Promise((resolve, reject) => {
    list.save((err, list) => {
      if (err) {return reject(err)}
      return resolve(list)
    })
  })
}

exports.stubLocation = function() {
  let location = new Location({
    placeId: 'ChIJ99ro0TzvwIcRZ4gy5tGQ_4o'
  });
  return new Promise((resolve, reject) => {
    location.save((err, location) => {
      if (err) {return reject(err)}
      return resolve(location)
    })
  })
}

exports.stubActivity = function() {

  return new Promise((resolve, reject) => {
    return Promise.all([exports.stubLocation(), exports.stubList()]).then((values) => {
      let activity = new Activity({
        description: 'Ate 6 Whoppers',
        _list: values[1]._id,
        _location: values[0]._id
      });
      return activity.save((err, activity) => {
        if (err) {return reject(err)}
        return resolve(activity)
      })
    })
  })
}


exports.cleanUp = function() {
  return Promise.all([
    exports.removeActivities(),
    exports.removeLocations(),
    exports.removeLists()
  ])
}
