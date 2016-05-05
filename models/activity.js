'use strict'

const keystone = require('keystone');
const Types = keystone.Field.Types;
const Activity = new keystone.List('Activity');
const ActivityList = keystone.List('ActivityList')

Activity.add({
  description: { type: Types.Textarea, required: true, initial: true },
  activity_list: { type: Types.Relationship, ref: 'ActivityList', required: true, initial: true },
  location: { type: Types.Relationship, ref: 'Location' },
  creator: { type: Types.Relationship, ref: 'User', required: true, initial: true },
  createdAt:   { type: Types.Datetime, required: true, default: Date.now },
  completedCount: { type: Number, default: 0 },
})

Activity.schema.methods.getLocationData = function() {
  return new Promise((resolve, reject) => {
    return Location.findOne({_id: this._location}).exec((err, location) => {
      console.log(err);
      if (err) { reject(err) }
      location.getDetails().then((details) => {
        details._id = location._id
        details.id = location.id
        resolve(details)
      }).catch((err) => {
        reject(err)
      })
    })
  })
}

Activity.schema.methods.changeCompletedCount = function(inc) {
  this.completedCount+=inc
  return this.save()
}

Activity.schema.pre('remove', function(done) {
  ActivityList.findOne({_id: this._list}).then((list) => {
    if (list) {list.changeActivityCount(-1)}
  })
  done()
})

Activity.schema.pre('save', function(done) {
  if (this.isNew) {
    ActivityList.findOne({_id: this._list}).then((list) => {
      if (list) {list.changeActivityCount(1)}
    })
  }
  done()
})


Activity.register()
module.exports = Activity
