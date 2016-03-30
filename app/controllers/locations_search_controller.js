const Joi    = require('joi'),
      Boom   = require('boom'),
      Places = require('../lib/places'),
      List   = require('../models/list').List

exports.getPredictions = {
  tags: ['api'],
  description: 'Search for a location',
  notes: 'Currently searches `establishments` only from Google Places. Returns Google Places results',
  validate: {
    params: {
      search: Joi.string().required().description('partial search term for autocomplete')
    }
  },
  handler: (request, reply) => {
    Places.autoComplete(request.params.search).then((results) => {
      reply({results: results})
    }, (err) => {
      reply(Boom.badImplementation(err))
    })
  }
}
