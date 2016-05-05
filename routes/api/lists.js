'use strict'

const keystone = require('keystone')
const Boom     = require('boom')
const ActivityList = keystone.list('ActivityList')

exports.index = (req, res) => {
  ActivityList.model.find({}).populate('creator').exec((err, lists) => {
    if (!err) {
      res.json({lists: lists});
    } else {
      res.json(Boom.badImplementation(err));
    }
  });
}

exports.show = (req, res) => {
  ActivityList.model.findOne({'_id': request.params.listId})
  .populate('creator')
  .exec((err, list) => {
    if (err) { return res.json(Boom.notFound(err)) }
    if (!list) { return res.json(Boom.notFound()) }
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
      res.json(Boom.badImplementation(err))
    })
  });
}

exports.create = (req, res) => {
  var list = new ActivityList.model(req.body);
  list.creator = req.currentUser()._id
  list.save(function(err, user) {
    if (err) {
      if (11000 === err.code || 11001 === err.code) {
        res.json(Boom.forbidden("please provide another list id, it already exist"));
      } else res.json(Boom.forbidden(getErrorMessageFrom(err))); // HTTP 403
    } else {
      res.json({list: list.toObject()}).created('/list/' + list._id); // HTTP 201
    }
  });
}

exports.update = (req, res) => {
  ActivityList.model.findOne({
    '_id': request.params.listId,
    'creator': request.currentUser()._id
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

exports.destroy = (req, res) => {
  ActivityList.model.findOne({
    '_id': request.params.listId,
    'creator': request.currentUser()._id
  }, function(err, list) {
    if (!err && list) {
      list.remove();
      res.status(200).json({
          message: "List deleted successfully"
      });
    } else if (!err) {
      // Couldn't find the object.
      res.status(404).json(Boom.notFound());
    } else {
      res.status(422).json(Boom.badRequest("Could not delete List"));
    }
  });
}
