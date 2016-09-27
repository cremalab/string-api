const Joi                   = require('joi')
const stringActionsSchema   = require('../config/schemas/stringActionsSchema')
const activityActionsSchema = require('../config/schemas/activityActionsSchema')
const userActionsSchema     = require('../config/schemas/userActionsSchema')

module.exports = {
  respondWith: (attrs) => {
    return Object.assign({}, {
      date: new Date(),
      id: Date.now().toString(),
      position: 'left',
      sentiment: 'friendly',
      name: 'String',
      visible: true
    }, attrs)
  },
  checkSchema: (object, schema) => {
    let schemaRoot
    switch (schema.split(':')[0]) {
      case 'string':
        schemaRoot = stringActionsSchema
        break
      case 'activity':
        schemaRoot = activityActionsSchema
        break
      case 'user':
        schemaRoot = userActionsSchema
        break
      default:
        schemaRoot = stringActionsSchema
    }

    return new Promise((resolve, reject) => {
      try {
        Joi.assert(object, schemaRoot[schema.split(':')[1]])
        resolve(object)
      } catch(err) {
        return reject(err)
      }
    })
  }
}
