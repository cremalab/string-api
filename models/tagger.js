'use strict'

const keystone = require('keystone')
const Types    = keystone.Field.Types

const Tagger = new keystone.List('Tagger', {
  searchFields: 'tag keywords',
  defaultColumns: 'tag, keywords',
  defaultSort: '-createdAt',
  track: true
})

Tagger.add({
  tag: {
    type: Types.Text, note: `The tag to be added on keyword match`,
    required: true, initial: true
  },
  keywords: {
    type: Types.TextArray, required: true, initial: true,
    note: `if any of these are included in the activity description, this Tagger's tag will be added`
  }
})


Tagger.register()
module.exports = Tagger
