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
    name: 'Burger King',
    lat: 12.44,
    long: 1122.33,
    yelpId: 134
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
        listId: values[1].id,
        locationId: values[0].id
      });
      return activity.save((err, activity) => {
        if (err) {return reject(err)}
        return resolve(activity)
      })
    })
  })
}
