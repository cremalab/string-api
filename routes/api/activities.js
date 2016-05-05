'use strict'

const keystone = require('keystone')
const Boom     = require('boom')
const Activity = keystone.list('Activity')

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
  .populate('location, list')
  .exec((err, activity) => {
    if (err) {
      response.json(Boom.notFound(err));
    } else {
      let res = activity.toJSON()
      activity.getLocationData().then((details) => {
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
  var activity = new Activity.model(request.body)
  activity.creator = request.currentUser()._id

  activity.save(function(err, user) {
    if (err) {
      if (11000 === err.code || 11001 === err.code) {
        res.json(Boom.forbidden("please provide another activity id, it already exist"))
      } else res.json(Boom.badRequest(err))
    } else {

      res.status(210).json({activity: activity})
    }
  });
}

exports.update = (req, res) => {
  Activity.model.findOne({
    '_id': req.params.activityId
  }, function(err, activity) {
    if (!err) {
      activity.description = request.body.description;
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
    '_id': request.params.activityId
  }, function(err, activity) {
    if (!err && activity) {
      activity.remove();
      res.json({
          message: "Activity deleted successfully"
      });
    } else if (!err) {
      // Couldn't find the object.
      res.json(Boom.notFound());
    } else {
      res.json(Boom.badRequest("Could not delete Activity"));
    }
  });
}
