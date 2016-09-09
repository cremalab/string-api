'use strict'

const contentTagger = require('../lib/contentTagger')
const random   = require('mongoose-simple-random')
const keystone = require('keystone')
const Types    = keystone.Field.Types
const Activity = new keystone.List('Activity', {
  searchFields: 'description',
  defaultColumns: 'description, location, creator, createdAt, category',
  drilldown: 'activity_list',
  sortable: true,
  sortContext: 'ActivityList:activities',
  defaultSort: 'createdAt',
  map: {name: 'description'}
})

Activity.add({
  description: { type: Types.Textarea, required: true, initial: true },
  activity_list: { type: Types.Relationship, ref: 'ActivityList', initial: true },
  location: { type: Types.Relationship, ref: 'Location', initial: true },
  creator: { type: Types.Relationship, ref: 'User', required: true, initial: true },
  createdAt:   { type: Types.Datetime, required: true, default: Date.now },
  category: { type: Types.Select, options: 'eat, drink, see, do', initial: true },
  completedCount: { type: Types.Number, default: 0, noedit: true },
  recommendationScore: { type: Types.Number, default: 0, noedit: true },
  tags: { type: Types.TextArray, initial: true}
})

Activity.schema.plugin(random)

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
    if (list) {list.changeActivityCount(-1)}
  })
  done()
})

Activity.schema.pre('save', function(done) {
  if (this.isNew) {
    keystone.list('ActivityList').model.findOne({_id: this.activity_list}, (err, list) => {
      if (list) {list.changeActivityCount(1)}
    })
  }
  done()
})

Activity.schema.post('save', function() {
  // const desc = this.description
  // const cat = this.category
  // const self = this
  // DO THIS IN A WAY THAT DOESN'T LOOP FOREVER
  // return contentTagger.parseAndTag(self, desc, cat)
})

Activity.relationship({
  path: 'completions', ref: 'ActivityCompletion', refPath: 'activity'
})


Activity.register()
module.exports = Activity
