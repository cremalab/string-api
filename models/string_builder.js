'use strict'

const keystone = require('keystone');
const Types    = keystone.Field.Types;
const random   = require('mongoose-simple-random')
const R        = require('ramda')

const StringBuilder = new keystone.List('StringBuilder', {
  searchFields: 'user last_location',
  defaultColumns: 'name, last_location, user, activity_category',
  track: true,
  searchFields: 'name, placeId'
});

StringBuilder.add({
  createdAt:  { type: Types.Datetime, required: true, default: Date.now },
  updatedAt:  { type: Types.Datetime, required: true, default: Date.now },
  user: { type: Types.Relationship, ref: 'User', required: true, initial: true },
  rejected_locations: { type: Types.Relationship, ref: 'Location', many: true, initial: true },
  party_type: {
    type: Types.Select, options: 'solo, date, friends, family', initial: true,
    label: 'Current Activity Category'
  },
  last_location: {
    type: Types.Relationship, ref: 'Location', initial: true,
    label: 'Last Suggested Location'
  },
  activity_category: {
    type: Types.Select, options: 'eat, drink, see, do', initial: true,
    label: 'Current Activity Category'
  },
  activity_list: { type: Types.Relationship, ref: 'ActivityList', initial: true },
})

StringBuilder.schema.methods.rejectLocations = function(location_ids) {
  this.rejected_locations = R.uniq(this.rejected_locations.concat(location_ids))
  return this.save().then((s) => {console.log("SAVED");return this})
}

StringBuilder.register();
module.exports = StringBuilder
