const Joi = require('joi')

module.exports = {
  set_activity_type: Joi.object({
    currentUser: Joi.object({}).required().unknown(true),
    params: Joi.object({
      activity_type: Joi.string().required(),
      continued: Joi.boolean().optional()
    }).required().description('key/value pairs for data to be sent back')
  })

}
