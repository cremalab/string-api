'use strict'

const Joi      = require('joi'),
      Boom     = require('boom'),
      Activity = require('../models/activity').Activity

exports.getAll = {
  tags: ['api'],
  description: 'Get all Activities',
  notes: 'Probably not very useful.',
  handler: (request, reply) => {
    Activity.find({})
    .populate('_location')
    .limit(20)
    .exec((err, activities) => {
      if (!err) {
        reply({activities: activities});
      } else {
        reply(Boom.badImplementation(err));// 500 error
      }
    });
  }
};

exports.getOne = {
  tags: ['api'],
  description: 'Get an Activity',
  notes: "Includes location and Google Places location data",
  validate: {
    params: { activityId: Joi.string().required() }
  },
  handler: (request, reply) => {
    Activity.findOne({
      '_id': request.params.activityId
    })
    .populate('_location, _list')
    .exec((err, activity) => {
      if (err) {
        reply(Boom.notFound(err));
      } else {
        let res = activity.toJSON()
        activity.getLocationData().then((details) => {
          res.location = details
          reply({activity: res})
        }).catch((err) => {
          console.log(err);
          reply({activity: res})
        })
      }
    });
  }
};

exports.create = {
  tags: ['api'],
  description: 'Create an Activity',
  validate: {
    payload: {
      description: Joi.string().required(),
      _location: Joi.string().required().meta({className: 'location'}),
      _list: Joi.string().required().meta({className: 'list'})
    }
  },
  handler: function(request, reply) {
    var activity = new Activity(request.payload)
    activity._creator = request.currentUser()._id

    activity.save(function(err, user) {
      if (err) {
        if (11000 === err.code || 11001 === err.code) {
          reply(Boom.forbidden("please provide another activity id, it already exist"))
        } else reply(Boom.badRequest(err))
      } else {

        reply({activity: activity}).created('/activity/' + activity._id); // HTTP 201
      }
    });
  }
};

exports.update = {
  tags: ['api'],
  description: 'Update an Activity',
  validate: {
    params: {
      activityId: Joi.string().required()
    },
    payload: {
      description: Joi.string().required()
    }
  },
  handler: function(request, reply) {
    Activity.findOne({
      '_id': request.params.activityId
    }, function(err, activity) {
      if (!err) {
        activity.description = request.payload.description;
        activity.save(function(err, activity) {
          if (!err) {
            reply({activity: activity}); // HTTP 201
          } else {
            if (11000 === err.code || 11001 === err.code) {
              reply(Boom.forbidden());
            } else reply(Boom.forbidden(err)); // HTTP 403
          }
        });
      } else {
        reply(Boom.badImplementation(err)); // 500 error
      }
    });
  }
};

exports.remove = {
  tags: ['api'],
  description: 'Delete an Activity',
  validate: {
    params: {
      activityId: Joi.string().required()
    }
  },
  handler: function(request, reply) {
    Activity.findOne({
      '_id': request.params.activityId
    }, function(err, activity) {
      if (!err && activity) {
        activity.remove();
        reply({
            message: "Activity deleted successfully"
        });
      } else if (!err) {
        // Couldn't find the object.
        reply(Boom.notFound());
      } else {
        reply(Boom.badRequest("Could not delete Activity"));
      }
    });
  }
};
