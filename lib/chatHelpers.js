const Joi                   = require('joi')
const stringActionsSchema   = require('../config/schemas/stringActionsSchema')
const activityActionsSchema = require('../config/schemas/activityActionsSchema')

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
