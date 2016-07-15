'use strict'

const keystone = require('keystone');
const Types = keystone.Field.Types;
const random = require('mongoose-simple-random')

const StringBuilder = new keystone.List('StringBuilder', {
  searchFields: 'user last_location',
  defaultColumns: 'name, last_location, user, current_activity_category',
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
  current_activity_category: {
    type: Types.Select, options: 'eat, drink, see, do', initial: true,
    label: 'Current Activity Category'
  },
  activity_list: { type: Types.Relationship, ref: 'ActivityList', initial: true },
})

StringBuilder.register();
module.exports = StringBuilder
