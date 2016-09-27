'use strict'
const actions            = require('../../lib/chatActions')
const expect             = require('chai').expect
const helpers            = require('../testHelpers')
const en                 = require('../../config/locales/en')
const keystone           = require('keystone')
// const StringBuilder      = keystone.list('StringBuilder')
// const Activity           = keystone.list('Activity')

const chatInterface = {
  send: (msg) => msg
}

describe.only('userActions', function() {
  let userRec
  before(() => {
    return helpers.stubAuthUser().then((user) => {
      userRec = user
    })
  })
  describe('user:set_food_preference', () => {
    it('should update user record', () => {
      return actions.handle('user:set_food_preference', {
        params: {food_type: [`italian`, `asian`]},
        currentUser: userRec
      }, chatInterface).then(() => {
        return keystone.list('User').model.findOne({_id: userRec.id}).then((user) => {
          expect(user.food_preference).to.include(`italian`)
          expect(user.food_preference).to.include(`asian`)
        })
      })
    })
    it('should respond with drink question', () => {
      return actions.handle('user:set_food_preference', {
        params: {food_type: []},
        currentUser: userRec
      }, chatInterface).then((res) => {
        expect(res).to.be.an('object')
        expect(res).to.have.property('responseAction', 'user:set_drink_preference')
      })
    })
  })

  describe('user:set_drink_preference', () => {
    it('should update user record', () => {
      return actions.handle('user:set_drink_preference', {
        params: {drink_type: [`coffee`, `tea`]},
        currentUser: userRec
      }, chatInterface).then(() => {
        return keystone.list('User').model.findOne({_id: userRec.id}).then((user) => {
          expect(user.drink_preference).to.include(`coffee`)
          expect(user.drink_preference).to.include(`tea`)
        })
      })
    })
    it('should respond with see question', () => {
      return actions.handle('user:set_drink_preference', {
        params: {drink_type: []},
        currentUser: userRec
      }, chatInterface).then((res) => {
        expect(res).to.be.an('object')
        expect(res).to.have.property('responseAction', 'user:set_see_preference')
      })
    })
  })


  describe('user:set_see_preference', () => {
    it('should update user record', () => {
      return actions.handle('user:set_see_preference', {
        params: {see_type: [`museums`, `art_galleries`]},
        currentUser: userRec
      }, chatInterface).then(() => {
        return keystone.list('User').model.findOne({_id: userRec.id}).then((user) => {
          expect(user.see_preference).to.include(`museums`)
          expect(user.see_preference).to.include(`art_galleries`)
        })
      })
    })
    it('should respond with do question', () => {
      return actions.handle('user:set_see_preference', {
        params: {see_type: []},
        currentUser: userRec
      }, chatInterface).then((res) => {
        expect(res).to.be.an('object')
        expect(res).to.have.property('responseAction', 'user:set_do_preference')
      })
    })
  })

})
