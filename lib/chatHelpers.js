require('string_score')
const i18n     = require('../config/i18n')

const areSimilar = (input, phrase) => {
  return input.score(phrase, 0.5) > 0.8
}

module.exports = {
  respondWith: (attrs) => {
    return Object.assign({}, {
      date: new Date(),
      id: Date.now().toString(),
      position: 'left',
      sentiment: 'friendly',
      name: 'String'
    }, attrs)
  },
  areSimilar: areSimilar,
  wantsToCancel: (payload) => {
    return i18n.t('strings.cancel').some(ph => areSimilar(payload, ph))
  }
}
