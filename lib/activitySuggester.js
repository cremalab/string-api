const keystone      = require('keystone')
const Activity      = keystone.list('Activity')

const querySize = 30

const suggest = function(params) {
  if (!params.activity_type) throw new Error('activity_type required')
  if (!params.location) throw new Error('location required')
  const rejected = params.rejected || []

  return Activity.model.where({category: params.activity_type})
    .where({location: params.location})
    .where('_id').nin(rejected)
    .sort({recommendationScore: -1, completedCount: -1})
    .limit(querySize)
    .exec()
  .then((results) => {
    if (results.length == 0) {
      return Promise.reject({noActivities: true})
    }
    const rand = Math.floor(Math.random() * results.length)
    return results[rand]
  })
}


module.exports = {
  suggest: suggest
}
