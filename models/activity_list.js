'use strict'

const keystone = require('keystone');
const Types = keystone.Field.Types;
const ActivityList = new keystone.List('ActivityList');

ActivityList.add({
  description: { type: Types.Textarea, required: true, initial: true },
  createdAt: { type: Types.Datetime, required: true, default: Date.now },
  activityCount: { type: Types.Number, default: 0 },
  creator: { type: Types.Relationship, ref: 'User', required: true, initial: true },
  isPublished: { type: Types.Boolean, default: false },
  isKept: { type: Types.Boolean, default: false },
})

ActivityList.schema.methods.collectActivities = function() {
  return new Promise((resolve, reject) => {
    return keystone.list('Activity').model.find({activity_list: this._id}).exec((err, activities) => {
      if (err) { reject(err) }
      let dataLookups = activities.map((activity) => activity.getLocationData())
      Promise.all(dataLookups)
        .then((locations) => {
          resolve(activities.map((activity, i) => {
            activity = Object.assign({}, activity.toJSON())
            activity.location = locations[i]
            return activity
          }))
        })
        .catch((err) => reject(err))
    })
  })
}

ActivityList.schema.methods.collectCompletions = function(user) {
  return new Promise((resolve, reject) => {
    return keystone.list('ActivityCompletion').model.find({activity_list: this._id, user: user._id})
    .exec((err, completions) => {
      if (err) { reject(err) }
      return resolve(completions)
    })
  })
}

ActivityList.schema.methods.changeActivityCount = function(inc) {
  this.activityCount+=inc
  return this.save()
}

ActivityList.register()
module.exports = ActivityList
