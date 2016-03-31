"use strict"

const Joi    = require('joi'),
      Boom   = require('boom'),
      List   = require('../models/list').List

exports.getAll = {
  tags: ['api'],
  description: 'Get all lists',
  notes: 'Returns *all* lists. This will be scoped to user or location later. Does not include activities.',
  handler: (request, reply) => {
    List.find({}).populate('_creator').exec((err, lists) => {
      if (!err) {
        reply({lists: lists});
      } else {
        reply(Boom.badImplementation(err));
      }
    });
  }
};

exports.getOne = {
  tags: ['api'],
  description: 'Get an individual list',
  notes: 'Returns list with populated activities and their Google Places \
    location data. Could take a bit since it aggregates Google requests.',
  validate: {
    params: {
      listId: Joi.string().required().description('_id of list')
    }
  },
  handler: (request, reply) => {
    List.findOne({'_id': request.params.listId})
    .populate('_creator')
    .exec((err, list) => {
      if (err) { return reply(Boom.notFound(err)) }
      if (!list) { return reply(Boom.notFound()) }
      Promise.all([
        list.collectActivities(),
        list.collectCompletions(request.currentUser())
      ]).then((values) => {
        const activities  = values[0]
        const completions = values[1]
        let res           = list.toObject()
        res.activities    = activities
        return reply({list: res, userCompletions: completions });
      }).catch((err) => {
        reply(Boom.badImplementation(err))
      })
    });
  }
};

exports.create = {
  tags: ['api'],
  description: 'Create a list',
  notes: 'Associates the list to the current user',
  validate: {
    payload: {
      description: Joi.string().required()
    }
  },
  response: {
    schema: Joi.object({
      list: Joi.object().keys({
        _creator: Joi.any().required().meta({className: 'user'}),
        __v: Joi.any().required(),
        description: Joi.string().required(),
        _id: Joi.any().required(),
        activityCount: Joi.number().required(),
        createdAt: Joi.date().required(),
        isPublished: Joi.boolean().required(),
        isKept: Joi.boolean().required()
      })
    }).description('test')
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
        reply({list: list.toObject()}).created('/list/' + list._id); // HTTP 201
      }
    });
  }
};

exports.update = {
  tags: ['api'],
  description: 'Update a list',
  notes: 'Description is currently the only editable field',
  validate: {
    params: {
      listId: Joi.string().required().description('_id of list')
    },
    payload: {
      description: Joi.string(),
      isPublished: Joi.boolean(),
      isKept: Joi.boolean()
    }
  },
  response: {
    schema: Joi.object({
      list: Joi.object().keys({
        _creator: Joi.any().required().meta({className: 'user'}),
        __v: Joi.any().required(),
        description: Joi.string().required(),
        _id: Joi.any().required(),
        activityCount: Joi.number().required(),
        createdAt: Joi.date().required(),
        isPublished: Joi.boolean().required(),
        isKept: Joi.boolean().required()
      })
    }).description('test')
  },
  handler: function(request, reply) {
    List.findOne({
      '_id': request.params.listId,
      '_creator': request.currentUser()._id
    }, function(err, list) {
      if (err) {
        reply(Boom.badImplementation(err))
      } else {
        list.description = request.payload.description
        list.isPublished   = request.payload.isPublished
        list.save(function(err, list) {
          if (!err) {
            reply({list: list.toObject()})
          } else {
            if (11000 === err.code || 11001 === err.code) {
              reply(Boom.forbidden("please provide another user id, it already exist"));
            } else reply(Boom.forbidden(getErrorMessageFrom(err)))
          }
        })
      }
    })
  }
}

exports.remove = {
  tags: ['api'],
  validate: {
    params: {
      listId: Joi.string().required().description('_id of list')
    }
  },
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
