"use strict"

const Joi    = require('joi'),
      Boom   = require('boom'),
      List   = require('../models/list').List

exports.getAll = {
  handler: (request, reply) => {
    List.find({}, (err, lists) => {
      if (!err) {
        reply({lists: lists});
      } else {
        reply(Boom.badImplementation(err));// 500 error
      }
    });
  }
};

exports.getOne = {
  handler: (request, reply) => {
    List.findOne({'_id': request.params.listId})
    .exec((err, list) => {
      if (err) { return reply(Boom.notFound(err)) }
      if (!list) { return reply(Boom.notFound()) }
      Promise.all([
        list.collectActivities(),
        list.collectCompletions(request.currentUser())
      ]).then((values) => {
        const activities  = values[0]
        const completions = values[1]
        let res           = list.toJSON()
        res.activities    = activities
        return reply({list: res, userCompletions: completions });
      }).catch((err) => {
        reply(Boom.badImplementation(err))
      })
    });
  }
};

exports.create = {
  validate: {
    payload: {
      description: Joi.string().required()
    }
  },
  handler: function(request, reply) {
    var list = new List(request.payload);
    list._creator = request.currentUser()._id
    list.save(function(err, user) {
      if (err) {
        if (11000 === err.code || 11001 === err.code) {
          reply(Boom.forbidden("please provide another list id, it already exist"));
        } else reply(Boom.forbidden(getErrorMessageFrom(err))); // HTTP 403
      } else {
        reply({list: list}).created('/list/' + list._id); // HTTP 201
      }
    });
  }
};

exports.update = {
  validate: {
    payload: {
      description: Joi.string().required()
    }
  },

  handler: function(request, reply) {
    List.findOne({
      '_id': request.params.listId,
      '_creator': request.currentUser()._id
    }, function(err, list) {
      if (err) {
        reply(Boom.badImplementation(err)); // 500 error
      } else {
        list.description = request.payload.description;
        list.save(function(err, list) {
          if (!err) {
            reply({list: list}); // HTTP 201
          } else {
            if (11000 === err.code || 11001 === err.code) {
              reply(Boom.forbidden("please provide another user id, it already exist"));
            } else reply(Boom.forbidden(getErrorMessageFrom(err))); // HTTP 403
          }
        });
      }
    });
  }
};

exports.remove = {
  handler: function(request, reply) {
    List.findOne({
      '_id': request.params.listId,
      '_creator': request.currentUser()._id
    }, function(err, list) {
      if (!err && list) {
        list.remove();
        reply({
            message: "List deleted successfully"
        });
      } else if (!err) {
        // Couldn't find the object.
        reply(Boom.notFound());
      } else {
        reply(Boom.badRequest("Could not delete List"));
      }
    });
  }
};
