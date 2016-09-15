'use strict'

const keystone = require('keystone')
const Types = keystone.Field.Types
const Places = require('../lib/places')
const random = require('mongoose-simple-random')

const Location = new keystone.List('Location', {
  defaultColumns: 'name, placeId',
  track: true,
  defaultSort: '-createdAt',
  searchFields: 'name, placeId'
})

Location.add({
  placeId:   {
    type: String, initial: true, label: 'Google Maps Place ID',
    note: 'Unique identifier for Google API lookup',
    index: true
  },
  name: { type: String, initial: true },
  info: { type: Types.Location, initial: true },
  primaryCategory: { type: Types.Select, options: 'eat, drink, see, do', initial: true } // Set when creating location
})

Location.schema.methods.getDetails = function() {
  return Places.getDetails(this)
}

Location.relationship({
  path: 'activities', ref: 'Activity', refPath: 'location'
})

Location.schema.pre('save', function(done) {
  this.getDetails().then(done)
})

Location.schema.plugin(random)

Location.relationship({
  path: 'activities', ref: 'Activity', refPath: 'location'
})

Location.register()
module.exports = Location
