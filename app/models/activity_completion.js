'use strict'

const Mongoose = require('mongoose'),
      Schema = Mongoose.Schema

const ActivityCompletionSchema = new Schema({
    _activity:    { type: Schema.Types.ObjectId, required: true, ref: 'activity'},
    // _user:        { type: Schema.Types.ObjectId, required: true, ref: 'user' },
    _location:    { type: Schema.Types.ObjectId, required: true, ref: 'location' },
    createdAt:    { type: Date, required: true, default: Date.now },
    description:  { type: String, required: true }
})

ActivityCompletionSchema.pre("save", (next, done) => {
  Mongoose.models["activityCompletion"].findOne({
    _user: this._user, _activity: this._activity
  }, (err, results) => {
    if(err) {
      done(err)
    } else if(results) {
      this.invalidate("_activity","You have already completed this activity.")
      done(new Error("You have already completed this activity."))
    }
  })
  next()
});

const activityCompletion = Mongoose.model('activityCompletion', ActivityCompletionSchema)

module.exports = {
    ActivityCompletion: activityCompletion
}
