'use strict'

const Joi      = require('joi'),
      Boom     = require('boom'),
      Places   = require('../lib/places'),
      Location = require('../models/location').Location

exports.getAll = {
  tags: ['api'],
  description: 'Get all locations',
  notes: 'Returns *all* locations, does not include Google Places data.',
  handler: (request, reply) => {
    Location.find({}).limit(20).exec((err, locations) => {
      if (!err) {
        reply({locations: locations});
      } else {
        reply(Boom.badImplementation(err));// 500 error
      }
    });
  }
};

exports.getOne = {
  tags: ['api'],
  description: 'Get a location',
  notes: 'Returns a location _with_ Google Places data.',
  validate: {
    params: {
      locationId: Joi.string().required()
    }
  },
  handler: (request, reply) => {
    Location.findOne({
      '_id': request.params.locationId
    }, (err, location) => {
      if (err) {
        reply(Boom.notFound(err));
      } else {
        Places.getDetails(location.placeId).then((details) => {
          details._id = location._id
          details.id = location.id
          reply({location: details});
        })
      }
    });
  }
};

exports.create = {
  tags: ['api'],
  description: 'Create a Location',
  notes: 'Finds or creates Location with the passed `placeId`, which is an identifier for Google Places',
  validate: {
    payload: {
      placeId: Joi.string().required() // `place_id` prop of returned google suggestion
    }
  },
  handler: function(request, reply) {
    // placeId comes from Google's API
    let placeId = request.payload.placeId

    Places.getDetails(placeId).then((details) => {
      findOrCreateLocation(placeId).then((location) => {
        // merge ID with google details
        details.id  = location.id
        details._id = location.id
        reply({location: details}).created('/locations/' + location._id); // HTTP 201
      }, (err) => {
        reply(Boom.badImplementation(err))
      })
    }, (err) => {
      reply(Boom.notFound(err));
    }).catch((err) => {
      reply(Boom.notFound(err));
    })
  }
};

// private

function findOrCreateLocation(placeId) {
  return new Promise((resolve, reject) => {
    Location.findOne({placeId: placeId}, (err, location) => {
      if (err) { return reject(err) }
      if (location) {
        resolve(location)
      } else {
        var location = new Location({placeId: placeId})
        location.save((err, location) => {
          if (err) { return reject(err) }
          resolve(location)
        })
      }
    })
  })
}
