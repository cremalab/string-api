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
  ActivityList.model.findOne({'_id': req.params.listId})
  .populate('creator')
  .exec((err, list) => {
    if (err) { return res.status(422).json(Boom.notFound(err)) }
    if (!list) { return res.status(404).json(Boom.notFound()) }
    Promise.all([
      list.collectActivities(),
      list.collectCompletions(req.currentUser)
    ]).then((values) => {
      const activities  = values[0]
      const completions = values[1]
      let listJSON      = list.toObject()
      listJSON.activities    = activities
      return res.status(200).json({list: listJSON, userCompletions: completions });
    }).catch((err) => {
      res.status(422).json(Boom.badImplementation(err))
    })
  });
}

exports.create = (req, res) => {
  var list = new ActivityList.model(req.body);
  list.creator = req.currentUser._id
  list.save(function(err, user) {
    if (err) {
      if (11000 === err.code || 11001 === err.code) {
        res.status(422).json(Boom.forbidden("please provide another list id, it already exist"));
      } else res.status(422).json(Boom.forbidden(err)); // HTTP 403
    } else {
      res.status(201).json({list: list.toObject()})
    }
  });
}

exports.update = (req, res) => {
  ActivityList.model.findOne({
    '_id': req.params.listId,
    'creator': req.currentUser._id
  }, function(err, list) {
    if (err) {
      res.status(422).json(Boom.badImplementation(err))
    } else {
      list.description = req.body.description
      list.isPublished   = req.body.isPublished
      list.save(function(err, list) {
        if (!err) {
          res.status(200).json({list: list.toObject()})
        } else {
          if (11000 === err.code || 11001 === err.code) {
            res.status(422).json(Boom.forbidden("please provide another user id, it already exist"));
          } else res.status(403).json(Boom.forbidden(err))
        }
      })
    }
  })
}

exports.destroy = (req, res) => {
  ActivityList.model.findOne({
    '_id': req.params.listId,
    'creator': req.currentUser._id
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
