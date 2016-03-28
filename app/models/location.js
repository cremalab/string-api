'use strict'

const Mongoose = require('mongoose'),
      Schema = Mongoose.Schema,
      Places = require('../lib/places')

const LocationSchema = new Schema({
    placeId:   { type: String },
    reference: { type: String},
    createdAt:  { type: Date, required: true, default: Date.now }
})

LocationSchema.methods.getDetails = function() {
  return Places.getDetails(this.placeId)
}



let Location;
if (Mongoose.models.location) {
  Location = Mongoose.model('location');
} else {
  Location = Mongoose.model('location', LocationSchema);
}
module.exports = {
  Location: Location
}
