const Joi     = require('joi')

const userMessageSchema = Joi.object({
  text: Joi.string().required().example('I am String and I am cool.'),
  userId: Joi.number().integer().required(),
  responseOption: Joi.object({
    paramName: Joi.string().required().example('activity_type'),
    paramValue: Joi.alternatives().try(
      Joi.string().example('eat'),
      Joi.array(Joi.string())
    ).required()
  }).optional(),
  action: Joi.string().optional().example('string.get_suggested_location')
    .description('action that this message should trigger')
})

module.exports = userMessageSchema
