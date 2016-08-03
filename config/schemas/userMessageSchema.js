const Joi     = require('joi')

const userMessageSchema = Joi.object({
  text: Joi.string().required().example('I am String and I am cool.'),
  token: Joi.string().required(),
  params: Joi.object({}).optional().description('key/value pairs for data to be sent back'),
  action: Joi.string().optional().example('string.get_suggested_location')
    .description('action that this message should trigger')
})

module.exports = userMessageSchema
