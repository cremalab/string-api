'use strict'

const keystone = require('keystone')
const Boom     = require('boom')
const Places   = require('../../lib/places')
const Location = keystone.list('Location')

exports.index = (req, res) => {
  Location.model.find({}).limit(20).exec((err, locations) => {
    if (err) {
      res.json(Boom.badImplementation(err));// 500 error
    } else {
      res.json({locations: locations});
    }
  });
}

exports.create = (req, res) => {
  let placeId = req.body.placeId
  Places.getDetails(placeId).then((details) => {
    let name    = details.name
    findOrCreateLocation(placeId, {name: name}).then((location) => {
      // merge ID with google details
      details.id  = location.id
      details._id = location.id
      res.status(201).json({location: details}).created('/locations/' + location._id); // HTTP 201
    }, (err) => {
      res.json(Boom.badImplementation(err))
    })
  }, (err) => {
    res.json(Boom.notFound(err));
  }).catch((err) => {
    res.json(Boom.notFound(err));
  })
}

exports.show = (req, res) => {
  Location.model.findOne({
    '_id': req.params.locationId
  }, (err, location) => {
    if (err) {
      res.json(Boom.notFound(err));
    } else {
      Places.getDetails(location.placeId).then((details) => {
        // details._id = location._id
        details.id  = location.id
        res.json({location: details});
      })
    }
  });
}

exports.search = (req, res) => {
  Places.autoComplete(req.params.search).then((results) => {
    res.status(200).json({results: results})
  }, (err) => {
    res.status(422).json(Boom.badImplementation(err))
  })
}

// private

function findOrCreateLocation(placeId, attrs) {
  attrs = attrs || {}
  return new Promise((resolve, reject) => {
    Location.model.findOne({placeId: placeId}, (err, location) => {
      if (err) { return reject(err) }
      if (location) {
        resolve(location)
      } else {
        attrs = Object.assign({}, attrs, {placeId: placeId})
        var location = new Location.model(attrs)
        location.save((err, location) => {
          if (err) { return reject(err) }
          resolve(location)
        })
      }
    })
  })
}
