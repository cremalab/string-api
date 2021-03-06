'use strict'

const keystone = require('keystone')
const Boom     = require('boom')
const Activity = keystone.list('Activity')
const Places   = require('../../lib/places')

exports.index = (req, res) => {
  Activity.model.find({})
  .populate('location')
  .limit(20)
  .exec((err, activities) => {
    if (!err) {
      res.json({activities: activities})
    } else {
      res.json(Boom.badImplementation(err))// 500 error
    }
  })
}

exports.show = (req, response) => {
  console.log(req.params.activityId)
  Activity.model.findOne({
    '_id': req.params.activityId
  })
  .populate(['location', 'activity_list'])
  .exec((err, activity) => {
    if (err) {
      response.json(Boom.notFound(err))
    } else {
      let res = activity.toJSON()
      // response.json({activity: res})
      Places.getDetails(activity.location).then((details) => {
        res.location = details
        response.json({activity: res})
      }).catch((err) => {
        response.status(422).json(Boom.badRequest(err))
      })
    }
  })
}

exports.create = (req, res) => {
  var activity = new Activity.model(req.params.activity)
  activity.creator = req.currentUser._id

  activity.save(function(err) {
    if (err) {
      console.log('error you dummy')
      console.log(err)
      if (11000 === err.code || 11001 === err.code) {
        res.status(403).json(Boom.forbidden('please provide another activity id, it already exist'))
      } else res.status(422).json(Boom.badRequest(err))
    } else {
      res.status(201).json({activity: activity})
    }
  })
}

exports.update = (req, res) => {
  Activity.model.findOne({
    '_id': req.params.activityId
  }, function(err, activity) {
    if (!activity) {
      res.status(404).json(Boom.notFound(err))
    }
    if (!err) {
      activity.description = req.body.description
      activity.save(function(err, activity) {
        if (!err) {
          res.status(200).json({activity: activity}) // HTTP 201
        } else {
          res.status(422).json(Boom.forbidden(err))
        }
      })
    } else {
      res.status(422).json(Boom.badImplementation(err)) // 500 error
    }
  })
}


exports.destroy = (req, res) => {
  Activity.model.findOne({
    '_id': req.params.activityId
  }, function(err, activity) {
    if (!err && activity) {
      activity.remove()
      res.json({
        message: 'Activity deleted successfully'
      })
    } else if (!err) {
      // Couldn't find the object.
      res.status(404).json(Boom.notFound())
    } else {
      res.status(422).json(Boom.badRequest('Could not delete Activity'))
    }
  })
}
