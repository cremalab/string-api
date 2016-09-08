const Joi = require('joi')

module.exports = {
  set_recommendation: Joi.object({
    currentUser: Joi.object({}).required().unknown(true),
    text: Joi.string().optional(),
    token: Joi.string(),
    action: Joi.string(),
    params: Joi.object({
      recommended: Joi.string().allow(['yes', 'no']).required(),
      activity: Joi.string().required(),
      activity_completion: Joi.string().required()
    }).required().description('key/value pairs for data to be sent back')
  })
}
