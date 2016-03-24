const Joi    = require('joi'),
      Boom   = require('boom'),
      List   = require('../models/list').List
      Places = require('../lib/places')

exports.getPredictions = {
  handler: (request, reply) => {
    Places.autoComplete(request.params.search).then((results) => {
      reply(results)
    }, (err) => {
      reply(Boom.badImplementation(err))
    })
  }
}
