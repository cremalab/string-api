'use strict'
const models = require('../../app/models/index')
const Activity = require('../../app/models/activity').Activity
const List = require('../../app/models/list').List
const User = require('../../app/models/user').User
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

exports.removeUsers = function() {
  return new Promise((resolve, reject) => {
    User.remove({}, (err) => {
      if (err) { return reject(err) }
      return resolve()
    })
  })
}

exports.stubList = function() {
  let list = new List({description: '#art #walk in the #crossroads'});
  return new Promise((resolve, reject) => {
    exports.stubLocation().then((location) => {
      list.save((err, list) => {
        if (err) {return reject(err)}
        let activity = new Activity({
          description: 'Ordered a dozen donuts',
          _list: list._id,
          _location: location._id
        })
        activity.save((err, activity) => {
          return resolve(list)
        })
      })
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

exports.stubUnauthUser = function() {
  let user = new User({
    phone: 9999999999,
    tempToken: 'mbjAzOEOB1KKWhMB',
    verificationCode: 12345,
    tokenedAt: Date.now(),
  });
  return new Promise((resolve, reject) => {
    user.save((err, user) => {
      if (err) {return reject(err)}
      return resolve(user)
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
    exports.removeLists(),
    exports.removeUsers()
  ])
}
