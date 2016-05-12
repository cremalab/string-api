'use strict'

const keystone = require('keystone');
const Types = keystone.Field.Types;
const Places = require('../lib/places')
const Location = new keystone.List('Location', {
  searchFields: 'name placeId',
  defaultColumns: 'name, placeId',
  track: true,
  searchFields: 'name, placeId'
});

Location.add({
  createdAt:  { type: Types.Datetime, required: true, default: Date.now },
  placeId:   {
    type: String, initial: true, label: "Google Maps Place ID",
    note: "Unique identifier for Google API lookup",
    index: true
  },
  name: { type: String, initial: true },
  info: { type: Types.Location, initial: true }
})

Location.schema.methods.getDetails = function() {
  return Places.getDetails(this.placeId)
}

Location.relationship({
  path: 'activities', ref: 'Activity', refPath: 'location'
});

Location.register();
module.exports = Location
