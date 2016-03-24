'use strict'

const Joi      = require('joi'),
      Boom     = require('boom'),
      Places   = require('../lib/places'),
      Location = require('../models/location').Location

exports.getAll = {
  handler: (request, reply) => {
    Location.find({}).limit(20).exec((err, locations) => {
      if (!err) {
        reply(locations);
      } else {
        reply(Boom.badImplementation(err));// 500 error
      }
    });
  }
};

exports.getOne = {
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
          reply(details);
        })
      }
    });
  }
};

exports.create = {
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
        reply(details).created('/locations/' + location._id); // HTTP 201
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
