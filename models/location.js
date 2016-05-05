'use strict'

const keystone = require('keystone');
const Types = keystone.Field.Types;
const Location = new keystone.List('Location');
const Places = require('../lib/places')

Location.add({
  createdAt:  { type: Types.Datetime, required: true, default: Date.now },
  placeId:   { type: String },
  reference: { type: String },
  info: { type: Types.Location }
})

Location.schema.methods.getDetails = function() {
  return Places.getDetails(this.placeId)
}

Location.register();
module.exports = Location
