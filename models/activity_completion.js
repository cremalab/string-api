'use strict'

const keystone = require('keystone')
const Types = keystone.Field.Types
const ActivityCompletion = new keystone.List('ActivityCompletion', {
  defaultColumns: 'user, activity, createdAt',
  drilldown: 'activity_list',
  sortContext: 'ActivityList:activities'
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
  activity_list: { type: Types.Relationship, ref: 'ActivityList', initial: true },
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
  let recommendationInc = 0, completedInc = 0
  if ( this.isModified('recommended') ) {
    if (this.recommended == 'yes') {recommendationInc = 1}
    if (this.recommended == 'no')  {recommendationInc = -1}
  }
  if (this.isNew) { completedInc = 1 }
  keystone.list('Activity').model.findOneAndUpdate({_id: this.activity}, {
    $inc: {completedCount: completedInc, recommendationScore: recommendationInc}
  }, {new: true}).then(() => {
    return next()
  })
})

ActivityCompletion.schema.pre('remove', function(next) {
  let recommendationInc = 0
  if (this.recommended == 'yes') {recommendationInc = -1}
  if (this.recommended == 'no')  {recommendationInc = 1}
  keystone.list('ActivityList').model.findOne({_id: this.activity_list}, (err, list) => {
    if (list) {list.changeActivityCount(-1)}
  })

  return keystone.list('Activity').model.findOneAndUpdate({_id: this.activity}, {
    $inc: {completedCount: -1, recommendationScore: recommendationInc}
  }, {}).then(() => {
    return next()
  }).catch(() => {
    this.invalidate('Activity does not exist')
    return next()
  })
})

// ActivityCompletion.schema.virtual('activity_list').get(function() {
//   return this.activity.activity_list
// })

ActivityCompletion.register()
module.exports = ActivityCompletion
