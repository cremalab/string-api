'use strict'

const keystone = require('keystone')
const Boom     = require('boom')
const ActivityCompletion = keystone.list('ActivityCompletion')
const Activity = keystone.list('Activity')

exports.create = (req, res) => {
  const activityId = req.body.activity
  Activity.model.findOne({_id: activityId}, (err, activity) => {
    if ( err ) { return res.status(422).json(Boom.badRequest(err) ) }
    if ( !activity ) { return res.status(404).json(Boom.notFound("Activity not found")) }

    let completion = new ActivityCompletion.model({
      activity: activityId,
      location: activity.location,
      user: req.currentUser._id,
      description: activity.description
    })
    completion.save((err, completion) => {
      if ( err ) { return res.status(422).json(Boom.badRequest(err)) }
      res.status(201).json({activity_completion: completion})
    })
  })
}

exports.destroy = (req, res) => {
  const id = req.params.activityCompletionId
  ActivityCompletion.model.findOne({_id: id}, (err, completion) => {
    if ( err ) { return res.json(Boom.badRequest(err) ) }
    if ( !completion ) { return res.json(Boom.notFound("Activity Completion not found")) }
    Activity.model.findOne({_id: completion.activity}, (err, activity) => {
      if (!err && activity) {activity.changeCompletedCount(-1)}
    })
    completion.remove()
    res.json({message: "Activity Completion deleted successfully"})
  })
}
