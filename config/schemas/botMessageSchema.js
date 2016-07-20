const Joi     = require('joi')

const botMessageSchema = Joi.object({
  text: Joi.string().required().example('I am String and I am cool.'),
  date: Joi.date().required(),
  id: Joi.string().required(),
  position: Joi.string().valid(['left', 'right', 'center']).required().example('right'),
  sentiment: Joi.string().valid(['friendly', 'sad', 'annoyed']).example('friendly'),
  name: Joi.string().required().valid("String").example('String'),
  media: Joi.array().items(Joi.object({
    type: Joi.string().required().example('image'),
    data: Joi.any().required().example('http://www.silly-string.com/images/logo.png')
  })).optional(),
  responseOptions: Joi.object({
    items: Joi.array().items(Joi.object({
      text: Joi.string().required().example('Eat'),
      params: Joi.object().required().example({activity_type: 'eat'}),
    })).optional(),
    multi: Joi.boolean().optional().default(false)
  }),
  responseAction: Joi.string().optional().example('string.type'),
  responseParams: Joi.object().optional().description('additional params to pass with the response'),
  responseType: Joi.string().valid(['choice', 'text'])
    .description('lets the client know what UI to provide for answering the question')
})

module.exports = botMessageSchema
