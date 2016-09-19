const ch                 = require('../../chatHelpers')
const allActions         = require('../')

const actions = {
  // Used to request most recent geo location of user
  'user:get_geo': (payload) => {
    return ch.respondWith({
      text: undefined,
      visible: false,
      responseType: `userLocation`,
      responseAction: 'user:set_geo',
      responseParams: {
        continued: true,
        nextAction: payload.params.nextAction
      }
    })
  },
  // Now we've got an updated userLocation, continue with next action
  'user:set_geo': (payload, chatInterface) => {
    console.log('received updated userLocation')
    return allActions[payload.params.nextAction](payload, chatInterface)
  }
}


module.exports = actions
