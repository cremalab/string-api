'use strict'

const Mongoose = require('mongoose'),
      Schema = Mongoose.Schema

const ActivityCompletionSchema = new Schema({
    _activity:    { type: Schema.Types.ObjectId, required: true, ref: 'activity'},
    _user:        { type: Schema.Types.ObjectId, required: true, ref: 'user' },
    _location:    { type: Schema.Types.ObjectId, ref: 'location' },
    createdAt:    { type: Date, required: true, default: Date.now },
    description:  { type: String, required: true }
})

ActivityCompletionSchema.pre("save", function(next) {

  Mongoose.models["activityCompletion"].findOne({
    _user : this._user, _activity: this._activity
  }, '_activity', (err, results) => {
    if(err) {
      next(err);
    } else if(results) {
      this.invalidate("_activity", "You have already completed this activity");
      next(new Error("You have already completed this activity"));
    } else {
      next();
    }
  });
});

const activityCompletion = Mongoose.model('activityCompletion', ActivityCompletionSchema)

module.exports = {
    ActivityCompletion: activityCompletion
}
