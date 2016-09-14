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
  }),
  handle_image_choice: Joi.object({
    currentUser: Joi.object({}).required().unknown(true),
    text: Joi.string().optional(),
    token: Joi.string(),
    action: Joi.string(),
    params: Joi.object({
      takePhoto: Joi.boolean().required(),
      activity_completion: Joi.string(),
      activity: Joi.string()
    }).required().description('key/value pairs for data to be sent back')
  }),
  add_image: Joi.object({
    currentUser: Joi.object({}).required().unknown(true),
    text: Joi.string().optional(),
    token: Joi.string(),
    action: Joi.string(),
    params: Joi.object({
      activity_completion: Joi.string().required(),
      image: Joi.object({
        secure_url: Joi.string().uri().required(),
        url: Joi.string().uri().required(),
        resource_type: Joi.string().required().allow('image'),
        format: Joi.string().required(),
        height: Joi.number().integer().required(),
        width: Joi.number().integer().required(),
        public_id: Joi.string().required().description('public_id from Cloudinary')
      }).description('Payload from cloudinary successful upload')
    }).required().description('key/value pairs for data to be sent back')
  })
}
