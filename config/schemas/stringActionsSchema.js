const Joi = require('joi')

module.exports = {
  set_activity_type: Joi.object({
    currentUser: Joi.object({}).required().unknown(true),
    text: Joi.string().optional(),
    token: Joi.string(),
    action: Joi.string(),
    params: Joi.object({
      activity_type: Joi.string().required(),
      continued: Joi.boolean().optional()
    }).required().description('key/value pairs for data to be sent back'),
    userLocation: Joi.object({}).optional().unknown(true)
  }),
  set_party_type: Joi.object({
    currentUser: Joi.object({}).required().unknown(true),
    text: Joi.string().optional(),
    token: Joi.string(),
    action: Joi.string(),
    params: Joi.object({
      party_type: Joi.string().required(),
      continued: Joi.boolean().optional()
    }).required().description('key/value pairs for data to be sent back'),
    userLocation: Joi.object({}).optional().unknown(true)
  }),
  respond_to_activity_suggestion: Joi.object({
    currentUser: Joi.object({}).required().unknown(true),
    text: Joi.string().optional(),
    token: Joi.string(),
    action: Joi.string(),
    params: Joi.object({
      accepted: Joi.boolean().required(),
      continued: Joi.boolean().optional(),
      activity: Joi.string().required(),
      activity_type: Joi.string().required()
    }).required().description('key/value pairs for data to be sent back'),
    userLocation: Joi.object({}).optional().unknown(true)
  }),
  create_activity: Joi.object({
    currentUser: Joi.object({}).required().unknown(true),
    text: Joi.string().required(),
    token: Joi.string(),
    action: Joi.string(),
    params: Joi.object({
      location: Joi.string().required(),
      category: Joi.string().required()
    }).required().description('key/value pairs for data to be sent back'),
    userLocation: Joi.object({}).optional().unknown(true)
  })

}
