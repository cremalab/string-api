'use strict'

const Joi                = require('joi'),
      Boom               = require('boom'),
      Activity           = require('../models/activity').Activity,
      ActivityCompletion = require('../models/activity_completion').ActivityCompletion

exports.create = {
  validate: {
    payload: {
      _activity: Joi.string().required()
    }
  },
  handler: (request, reply) => {
    const activityId = request.payload._activity
    Activity.findOne({_id: activityId}, (err, activity) => {
      if ( err ) { return reply(Boom.badRequest(err) ) }
      if ( !activity ) { return reply(Boom.notFound("Activity not found")) }

      let completion = new ActivityCompletion({
        _activity: activityId,
        _list: activity._list,
        _location: activity._location,
        _user: request.currentUser()._id,
        description: activity.description
      })
      completion.save((err, completion) => {
        if ( err ) { return reply(Boom.badRequest(err)) }
        reply({activity_completion: completion})
          .created('/activity_completions/' + completion._id)
      })
    })
  }
}

exports.remove = {
  validate: {
    params: {
      activityCompletionId: Joi.string().required()
    }
  },
  handler: (request, reply) => {
    const id = request.params.activityCompletionId
    ActivityCompletion.findOne({_id: id}, (err, completion) => {
      if ( err ) { return reply(Boom.badRequest(err) ) }
      if ( !completion ) { return reply(Boom.notFound("Activity Completion not found")) }
      completion.remove()
      reply({message: "Activity Completion deleted successfully"})
    })
  }
}
