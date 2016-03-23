const Mongoose = require('mongoose'),
      Schema = Mongoose.Schema

const ActivityCompletionSchema = new Schema({
    activityId:   { type: Schema.Types.ObjectId, required: true },
    description:  { type: String, required: true },
    userId:       { type: Schema.Types.ObjectId, required: true },
    createdAt:    { type: Date, required: true, default: Date.now },
    description:  { type: String, default: 0},
    locationId:   { type: Schema.Types.ObjectId, required: true },
    locationName: { type: String },
    recommended:  { type: Boolean }
})

const activityCompletion = Mongoose.model('activityCompletion', ActivityCompletionSchema)

module.exports = {
    ActivityCompletion: activityCompletion
}
