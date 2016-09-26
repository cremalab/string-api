'use strict'

const keystone = require('keystone')
const Types    = keystone.Field.Types

const Tagger = new keystone.List('Tagger', {
  searchFields: 'tag keywords',
  defaultColumns: 'tag, keywords, activity_types',
  defaultSort: '-createdAt',
  track: true,
  map: {name: 'tag'}
})

Tagger.add({
  tag: {
    type: Types.Text, note: `The tag to be added on keyword match`,
    required: true, initial: true
  },
  activity_types: {
    type: Types.TextArray, required: true, initial: true,
    note: `will only be applied if activity is of one of these types`,
    default: [], label: 'Activity Types'
  },
  keywords: {
    type: Types.TextArray, required: true, initial: true,
    default: [],
    note: `if any of these are included in the activity description, this Tagger's tag will be added`
  },
  active: { type: Types.Boolean, initial: true, default: true }
})


Tagger.register()
module.exports = Tagger
