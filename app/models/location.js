const Mongoose = require('mongoose'),
      Schema = Mongoose.Schema

const LocationSchema = new Schema({
    locationId: { type: String, unique: true, required: true },
    name:       { type: String, required: true },
    lat:        { type: String, required: true },
    long:       { type: String, required: true },
    yelpId:     { type: Number },
    createdAt:  { type: Date, required: true, default: Date.now }
})

const location = Mongoose.model('location', LocationSchema)

module.exports = {
    Location: location
}
