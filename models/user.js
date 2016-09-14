'use strict'

const JWT = require('jsonwebtoken')
const keystone = require('keystone')
const Types = keystone.Field.Types

/**
 * User Model
 * ==========
 */

var User = new keystone.List('User', {
  searchFields: 'name, phone, email'
})

User.add({
  name: { type: String, index: true, initial: true },
  email: { type: Types.Email, initial: true, index: true, displayGravatar: true },
  password: { type: Types.Password, initial: true },
  token: { type: String },
  tempToken: { type: String },
  phone: {
    type: String,
    initial: true,
    validate: {
      validator: function(v) {
        return /\d{10}/.test(v)
      },
      message: '{VALUE} is not a valid phone number!'
    },
    required: [true, 'User phone number required']
  },
  tokenedAt: { type: Types.Datetime },
  verificationCode: { type: Types.Number, label: 'Verification Code'},
  verificationSentAt: { type: Types.Datetime, label: 'Verification Code Sent At' },
  activity_lists: { type: Types.Relationship, ref: 'ActivityList', many: true },
  activities: { type: Types.Relationship, ref: 'Activity', many: true },
  activityCompletions: { type: Types.Relationship, ref: 'ActivityCompletion', many: true },
  string_builders: { type: Types.Relationship, ref: 'StringBuilder', many: true,
    filters: { user: ':_id' }
  }
}, 'Permissions', {
  isAdmin: { type: Boolean, label: 'Can access Keystone', index: true }
})

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function() {
  return this.isAdmin
})

User.relationship({ path: 'activity_lists', ref: 'ActivityList', refPath: 'creator' })
User.relationship({ path: 'activities', ref: 'Activity', refPath: 'creator' })
// User.relationship({ path: 'activity_completions', ref: 'ActivityCompletion', refPath: 'user' })
User.relationship({ path: 'string_builders', ref: 'StringBuilder', refPath: 'user' })

User.schema.methods.generateAuthToken = function() {
  const authObj = {
    token: this.token,
    userId: this._id
  }
  return JWT.sign(authObj, process.env['SIGNING_SECRET'])
}

User.schema.methods.toJSON = function() {
  let obj = this.toObject()
  delete obj.token
  delete obj.tokenedAt
  delete obj.tempToken
  delete obj.phone
  delete obj.verificationCode
  return obj
}

/**
 * Registration
 */

User.defaultColumns = 'name, email, isAdmin'
User.register()
module.exports = User
