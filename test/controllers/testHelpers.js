'use strict'
const models             = require('../../app/models/index')
const Activity           = require('../../app/models/activity').Activity
const ActivityCompletion = require('../../app/models/activity_completion').ActivityCompletion
const List               = require('../../app/models/list').List
const User               = require('../../app/models/user').User
const Location           = require('../../app/models/location').Location
const randtoken          = require('rand-token')

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
    _creator: user._id
  });
  return new Promise((resolve, reject) => {
    exports.stubLocation().then((location) => {
      list.save((err, list) => {
        if (err) {return reject(err)}
        let activity = new Activity({
          description: 'Ordered a dozen donuts',
          _list: list._id,
          _location: location._id,
          _creator: user._id
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
        _list: values[1]._id,
        _location: values[0]._id,
        _creator: user._id
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
      _user: user._id,
      _activity: activity._id,
      _location: activity._location,
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
