'use strict'
const chatHelpers = require('../../lib/chatHelpers')
require('../testHelpers')
const expect   = require('chai').expect

describe('chatHelpers', function() {
  describe('areSimilar', ()=> {
    it('should return a boolean', () => {
      let match = chatHelpers.areSimilar(
        'There once was a man from Nantucket',
        'There was a man Nantuck'
      )
      expect(match).to.be.a('Boolean')
    })
    it('should be pretty fuzzy', () => {
      let match = chatHelpers.areSimilar(
        'There once was a man from Nantucket',
        'There was a man Nantuck'
      )
      expect(match).to.be.true
    })
    it('shouldnt be TOO fuzzy', () => {
      let match = chatHelpers.areSimilar(
        'Th 1 was a man from N',
        'There was a man Nantuck'
      )
      expect(match).to.be.false
    })
  })

  describe('wantsToCancel', ()=> {
    it('should return a boolean', () => {
      let match = chatHelpers.wantsToCancel('biscuits')
      expect(match).to.be.a('Boolean')
    })
    it('should ignore trigger words in long phrases', () => {
      let match = chatHelpers.wantsToCancel('I ordered the Cancel Sandwich with a side of over start')
      expect(match).to.be.false
    })
    it('should return true for cancellation phrases', () => {
      expect(chatHelpers.wantsToCancel('start again')).to.be.true
      expect(chatHelpers.wantsToCancel('start over')).to.be.true
      expect(chatHelpers.wantsToCancel('cancel')).to.be.true
      expect(chatHelpers.wantsToCancel('exit')).to.be.true
      expect(chatHelpers.wantsToCancel('quit')).to.be.true
    })
  })
})
