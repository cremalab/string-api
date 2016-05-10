'use strict'

const keystone = require('keystone');
const Types = keystone.Field.Types;
const Location = new keystone.List('Location');
const Places = require('../lib/places')

Location.add({
  createdAt:  { type: Types.Datetime, required: true, default: Date.now },
  placeId:   { type: String },
  name: { type: String },
  info: { type: Types.Location }
})

Location.schema.methods.getDetails = function() {
  return Places.getDetails(this.placeId)
}

Location.relationship({
  path: 'activities', ref: 'Activity', refPath: 'location'
});

Location.register();
module.exports = Location
