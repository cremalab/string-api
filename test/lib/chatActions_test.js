'use strict'
const actions = require('../../lib/chatActions')
const helpers  = require('../testHelpers')
const keystone = require('../keystoneTestHelper');
const expect   = require('chai').expect

const app = keystone.app;

let listRecord, locationRecord, activityRecord, userRecord;

describe.only('chatActions', function() {
  describe('handle', () => {
    it('should return a response for string.type', () => {
      const res = { id: 'd5adc5ab-ab98-4a40-b327-630eb458e27f',
        timestamp: '2016-07-14T20:19:11.6Z',
        result:
         { source: 'agent',
           resolvedQuery: 'let\'s go',
           action: 'string.type',
           actionIncomplete: false,
           parameters: {},
           contexts: [ [Object], [Object], [Object] ],
           metadata:
            { intentId: 'b65aaad4-9fae-4116-b41c-fd55f1b22afd',
              webhookUsed: 'false',
              intentName: 'Start a String' },
           fulfillment: { speech: 'What kind of activity are you interested in?' },
           score: 1 },
        status: { code: 200, errorType: 'success' },
        sessionId: '00000000-0000-0000-0000-000000000000' }
      return actions.handle('string.type', res).then((res) => {
        expect(res).to.be.a('string')
        expect(res).to.equal('What kind of activity are you interested in?')
      })
    })

    it('should return a response for string.party_type', () => {
      const res = { id: 'fd948abc-39f4-4932-8814-6ab7b4947315',
        timestamp: '2016-07-14T20:19:14.48Z',
        result:
         { source: 'agent',
           resolvedQuery: 'eat',
           action: 'string.type',
           actionIncomplete: false,
           parameters: { activity_type: 'eat' },
           contexts: [ [Object], [Object], [Object] ],
           metadata:
            { intentId: '715743ea-4f60-4b6a-831c-1fc647fb3cd9',
              webhookUsed: 'false',
              intentName: 'TypeQuestion - Eat' },
           fulfillment: { speech: 'Absolutely! We\'ve I\'ve got some ideas. 🤔 Who are you going with?' },
           score: 1 },
        status: { code: 200, errorType: 'success' },
        sessionId: '00000000-0000-0000-0000-000000000000' }
      return actions.handle('string.type', res).then((res) => {
        expect(res).to.be.a('string')
        expect(res).to.contain('Who are you going with')
      })
    })
  })

  it('should return an object for string.get_location_suggestions', () => {
    const res = { id: '8f02ab8f-83e2-4954-90fc-64195764d7ce',
      timestamp: '2016-07-14T20:34:42.429Z',
      result:
       { source: 'agent',
         resolvedQuery: 'nobody',
         action: 'string.get_location_suggestions',
         actionIncomplete: false,
         parameters: { party_type: 'solo' },
         contexts: [ [Object], [Object], [Object] ],
         metadata:
          { intentId: '1c836088-57b1-441d-87fd-686b7a25027a',
            webhookUsed: 'false',
            intentName: 'PartyQuestion - Solo' },
         fulfillment: { speech: 'This is going to be depressing.' },
         score: 1 },
      status: { code: 200, errorType: 'success' },
      sessionId: '00000000-0000-0000-0000-000000000000' }
    return actions.handle('string.get_location_suggestions', res).then((res) => {
      expect(res).to.be.an('object')
      expect(Object.keys(res)).to.include('nameKey')
      expect(Object.keys(res)).to.include('item')
      expect(Object.keys(res)).to.include('imageUrl')
      expect(Object.keys(res)).to.include('eventType')
    })
  })

});
