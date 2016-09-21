'use strict'

const contentTagger = require('../lib/contentTagger')
const random   = require('mongoose-simple-random')
const keystone = require('keystone')
const Types    = keystone.Field.Types
const Activity = new keystone.List('Activity', {
  searchFields: 'description',
  defaultColumns: 'description, location, creator, createdAt, category',
  defaultSort: '-createdAt',
  map: {name: 'description'}
})

Activity.add({
  description: { type: Types.Textarea, required: true, initial: true },
  location: { type: Types.Relationship, ref: 'Location', initial: true },
  creator: { type: Types.Relationship, ref: 'User', required: true, initial: true },
  createdAt:   { type: Types.Datetime, default: Date.now },
  category: { type: Types.Select, options: 'eat, drink, see, do', initial: true },
  completedCount: { type: Types.Number, default: 0, noedit: true },
  recommendationScore: { type: Types.Number, default: 0, noedit: true },
  tags: { type: Types.TextArray, initial: true}
})

Activity.schema.plugin(random)

// to hold lat/long of occurance from Locaiton, denormalized querying
Activity.schema.add({
  geo: { type: [Number], index: '2dsphere' }
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

Activity.schema.pre('save', function(done) {
  if (this.isModified('description')) {
    contentTagger.parseAndTag(this, this.description, this.category)
  }
  if (!this.geo) {
    return keystone.list('Location').model.findOne({_id: this.location}).then((loc) => {
      this.geo = loc.info.geo
      return this.save().then(done)
    })
  }
  done()
})

Activity.relationship({
  path: 'completions', ref: 'ActivityCompletion', refPath: 'activity'
})


Activity.register()
module.exports = Activity
