'use strict'

const keystone = require('keystone')
const Types = keystone.Field.Types
const ActivityCompletion = new keystone.List('ActivityCompletion', {
  defaultColumns: 'user, activity, createdAt'
})

ActivityCompletion.add({
  activity:      {
    type: Types.Relationship, ref: 'Activity', required: true, initial: true
  },
  user:          {
    type: Types.Relationship, ref: 'User', required: true, initial: true
  },
  party_type: {
    type: Types.Select, options: 'solo, date, friends, family', initial: true,
    label: 'Completed with:'
  },
  location:      { type: Types.Relationship, ref: 'Location'},
  recommended:   {
    type: Types.Select,
    options: 'yes, no',
    initial: true,
    label: 'Recommended?',
    index: true
  },
  createdAt:     { type: Date, required: true, default: Date.now, initial: true },
  description:   { type: String, initial: true },
  image: { type: Types.CloudinaryImage, initial: true, folder: 'activity_completions' }
})

ActivityCompletion.schema.pre('save', function(next) {
  keystone.list('Activity').model.findById(this.activity, (err, activity) => {
    if (err) {return next(new Error(err))}
    if (!activity) {
      this.invalidate('Activity does not exist')
      return next()
    }
    activity.changeCompletedCount(1)
    next()
  })
})

ActivityCompletion.schema.pre('remove', function(next) {
  keystone.list('Activity').model.findById(this.activity, (err, activity) => {
    activity.changeCompletedCount(-1)
  })
  next()
})

ActivityCompletion.schema.virtual('activity_list').get(function() {
  return this.activity.activity_list
})

ActivityCompletion.register()
module.exports = ActivityCompletion
