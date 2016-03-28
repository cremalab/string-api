const Joi    = require('joi'),
      Boom   = require('boom'),
      Places = require('../lib/places'),
      List   = require('../models/list').List

exports.getPredictions = {
  handler: (request, reply) => {
    Places.autoComplete(request.params.search).then((results) => {
      reply({results: results})
    }, (err) => {
      reply(Boom.badImplementation(err))
    })
  }
}
