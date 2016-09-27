const Joi = require('joi')

module.exports = {
  set_name: Joi.object({
    currentUser: Joi.object({}).required().unknown(true),
    text: Joi.string().required(),
    token: Joi.string(),
    action: Joi.string(),
    params: Joi.object({
    }).required().description('key/value pairs for data to be sent back'),
    userLocation: Joi.object({}).optional().unknown(true)
  })
}
