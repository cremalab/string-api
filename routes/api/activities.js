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
      res.json({activities: activities});
    } else {
      res.json(Boom.badImplementation(err));// 500 error
    }
  });
}

exports.show = (req, response) => {
  Activity.model.findOne({
    '_id': req.params.activityId
  })
  .populate('location list')
  .exec((err, activity) => {
    if (err) {
      response.json(Boom.notFound(err));
    } else {
      let res = activity.toJSON()
      Places.getDetails(activity.location.placeId).then((details) => {
        res.location = details
        response.json({activity: res})
      }).catch((err) => {
        console.log(err);
        response.json({activity: res})
      })
    }
  });
}

exports.create = (req, res) => {
  var activity = new Activity.model(req.body)
  activity.creator = req.currentUser._id

  activity.save(function(err, user) {
    if (err) {
      if (11000 === err.code || 11001 === err.code) {
        res.status(403).json(Boom.forbidden("please provide another activity id, it already exist"))
      } else res.status(422).json(Boom.badRequest(err))
    } else {
      res.status(201).json({activity: activity})
    }
  });
}

exports.update = (req, res) => {
  Activity.model.findOne({
    '_id': req.params.activityId
  }, function(err, activity) {
    if (!err) {
      activity.description = req.body.description;
      activity.save(function(err, activity) {
        if (!err) {
          res.json({activity: activity}); // HTTP 201
        } else {
          if (11000 === err.code || 11001 === err.code) {
            res.json(Boom.forbidden());
          } else res.json(Boom.forbidden(err)); // HTTP 403
        }
      });
    } else {
      res.json(Boom.badImplementation(err)); // 500 error
    }
  });
}


exports.destroy = (req, res) => {
  Activity.model.findOne({
    '_id': req.params.activityId
  }, function(err, activity) {
    if (!err && activity) {
      activity.remove();
      res.json({
          message: "Activity deleted successfully"
      });
    } else if (!err) {
      // Couldn't find the object.
      res.status(404).json(Boom.notFound());
    } else {
      res.status(422).json(Boom.badRequest("Could not delete Activity"));
    }
  });
}
