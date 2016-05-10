'use strict'

const keystone = require('keystone');
const Types = keystone.Field.Types;
const Activity = new keystone.List('Activity', {
  searchFields: 'description',
  defaultColumns: 'description location',
  drilldown: 'activity_list',
  map: {name: 'description'}
});

Activity.add({
  description: { type: Types.Textarea, required: true, initial: true },
  activity_list: { type: Types.Relationship, ref: 'ActivityList', required: true, initial: true },
  location: { type: Types.Relationship, ref: 'Location' },
  creator: { type: Types.Relationship, ref: 'User', required: true, initial: true },
  createdAt:   { type: Types.Datetime, required: true, default: Date.now },
  completedCount: { type: Number, default: 0 },
})

Activity.schema.methods.changeCompletedCount = function(inc) {
  this.completedCount+=inc
  return this.save()
}

Activity.schema.methods.getLocationData = function() {
  return new Promise((resolve, reject) => {
    return keystone.list('Location').model.findOne({_id: this.location}).exec((err, location) => {
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

Activity.schema.pre('remove', function(done) {
  keystone.list('ActivityList').model.findOne({_id: this.list}, (err, list) => {
    console.log("LIST EXISTS?");
    console.log(list);
    if (list) {list.changeActivityCount(-1)}
  })
  done()
})

Activity.schema.pre('save', function(done) {
  if (this.isNew) {
    keystone.list('ActivityList').model.findOne({_id: this.list}, (err, list) => {
      if (list) {list.changeActivityCount(1)}
    })
  }
  done()
})

Activity.relationship({
  path: 'completions', ref: 'ActivityCompletion', refPath: 'activity'
});

Activity.register()
module.exports = Activity
