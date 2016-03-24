const Mongoose = require('mongoose'),
      Schema = Mongoose.Schema

const LocationSchema = new Schema({
    placeId:   { type: String },
    reference: { type: String},
    createdAt:  { type: Date, required: true, default: Date.now }
})

const location = Mongoose.model('location', LocationSchema)

module.exports = {
    Location: location
}
