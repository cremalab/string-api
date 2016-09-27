'use strict'

const keystone = require('keystone')
const Boom     = require('boom')
const Places   = require('../../lib/places')
const Location = keystone.list('Location')
const LocationSearcher = require('../../lib/locationSearcher')

exports.index = (req, res) => {
  Location.model.find({}).limit(20).exec((err, locations) => {
    if (err) {
      res.json(Boom.badImplementation(err))// 500 error
    } else {
      res.json({locations: locations})
    }
  })
}

exports.create = (req, res) => {
  let placeId = req.body.placeId
  Places.getDetails(placeId).then((details) => {
    const safeAttrs = {
      name: details.name,
      info: details.info
    }
    LocationSearcher.findOrCreateLocation(placeId, safeAttrs).then((location) => {
      // merge ID with google details
      details.id  = location.id
      details._id = location.id
      res.status(201).json({location: details}).created('/locations/' + location._id) // HTTP 201
    }, (err) => {
      res.json(Boom.badImplementation(err))
    })
  }, (err) => {
    res.json(Boom.notFound(err))
  }).catch((err) => {
    res.json(Boom.notFound(err))
  })
}

exports.show = (req, res) => {
  Location.model.findOne({
    '_id': req.params.locationId
  }, (err, location) => {
    if (err) {
      res.json(Boom.notFound(err))
    } else {
      Places.getDetails(location.placeId).then((details) => {
        // details._id = location._id
        details.id  = location.id
        res.json({location: details})
      })
    }
  })
}

exports.search = (req, res) => {
  Places.autoComplete(req.params.search).then((results) => {
    console.log(results)
    res.status(200).json({results: results})
  }, (err) => {
    res.status(422).json(Boom.badImplementation(err))
  })
}
