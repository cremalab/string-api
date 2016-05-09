'use strict'

const randtoken = require('rand-token')
const keystone  = require('./keystoneTestHelper')
const request   = require('supertest');
const app       = keystone.app;
const Path      = require('path')

var Activity           = keystone.list('Activity').model
var List               = keystone.list('ActivityList').model
var Location           = keystone.list('Location').model
var User               = keystone.list('User').model
var ActivityCompletion = keystone.list('ActivityCompletion').model
var ActivityCompletion = keystone.list('ActivityCompletion').model

require('chai')

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

exports.removeActivityCompletions = function() {
  return new Promise((resolve, reject) => {
    ActivityCompletion.remove({}, (err) => {
      if (err) { return reject(err) }
      return resolve()
    })
  })
}

exports.stubList = function(user) {
  let list = new List({
    description: '#art #walk in the #crossroads',
    creator: user._id
  });
  return new Promise((resolve, reject) => {
    exports.stubLocation().then((location) => {
      list.save((err, list) => {
        if (err) {return reject(err)}
        let activity = new Activity({
          description: 'Ordered a dozen donuts',
          activity_list: list._id,
          location: location._id,
          creator: user._id
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

exports.stubAuthUser = function() {
  let user = new User({
    phone: 9999999999,
    tempToken: null,
    verificationCode: null,
    token: randtoken.generate(16),
    tokenedAt: Date.now()
  });
  return new Promise((resolve, reject) => {
    user.save((err, user) => {
      if (err) {return reject(err)}
      return resolve(user)
    })
  })
}

exports.stubActivity = function(user) {
  return new Promise((resolve, reject) => {
    return Promise.all([exports.stubLocation(), exports.stubList(user)]).then((values) => {
      let activity = new Activity({
        description: 'Ate 6 Whoppers',
        activity_list: values[1]._id,
        location: values[0]._id,
        creator: user._id
      });
      return activity.save((err, activity) => {
        if (err) {return reject(err)}
        return resolve(activity)
      })
    })
  })
}

exports.stubActivityCompletion = function(activity, user) {
  return new Promise((resolve, reject) => {
    let completion = new ActivityCompletion({
      user: user._id,
      activity: activity._id,
      activity_list: activity.activity_list,
      location: activity._location,
      description: "Drank a Dark & Stormy"
    })
    completion.save((err, completion) => {
      if ( err ) { return reject(err) }
      return resolve(completion)
    })
  })
}

exports.authRequest = function(reqOpts, user) {
  reqOpts.headers = {
    "Authorization": user.generateAuthToken()
  }
  return reqOpts
}

exports.cleanUp = function() {
  return Promise.all([
    exports.removeActivities(),
    exports.removeActivityCompletions(),
    exports.removeLocations(),
    exports.removeLists(),
    exports.removeUsers()
  ])
}
