const actions          = require('./actions')

const handle = (type, payload, chatInterface) => {
  if ( Object.keys(actions).indexOf(type) < 0) {
    console.log('no handlers found')
    console.log(type)
    return Promise.reject(`String doesn't know how to handle '${type}'`)
  }
  return actions[type](payload, chatInterface)
}

// const proxy = (handler, params = {}, payload = {}) => {
//   // Call API methods and convert responses to whatever
//   const req = {
//     body: payload,
//     params: params,
//     currentUser: {}
//   }
//   const res = {
//     status: () => {return},
//     json: (response) => Promise.resolve(response)
//   }
//   return handler(req, res)
// }


module.exports = {
  handle: handle
}
