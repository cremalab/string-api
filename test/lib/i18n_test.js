'use strict'
const i18n = require('../../config/i18n')
const expect   = require('chai').expect

const testLocale = {
  example: `Cheeseburgers.`,
  welcome: `Hello there, {name}!`,
  instructions: {
    type: `Press the {key} key on the keyboard, {name}`,
    click: `Click the {button} mouse button, {name}`,
    speak: {
      loudly: `Scream "{phrase}"!`,
      quietly: `Whisper "{phrase}".`,
      angrily: {
        at_you: `WHY DID YOU DO THAT, {name}?!`,
        at_self: `WHY AM I SUCH A FOOL, {name}?!?!`
      }
    },
    'karate:chop': `Hi-YA!`,
    'karate:kick': `Hi-YAKICK!`
  }
}

describe('i18n', function() {
  describe('t', () => {
    it('should accept a locale object', () => {
      console.log(i18n.t('example', {}, testLocale));
      expect(i18n.t('example', {}, testLocale)).to.equal('Cheeseburgers.')
    })
    it('should return a string', () => {
      expect(i18n.t('example', {}, testLocale)).to.be.a('String')
    })
    it('should throw error if translation does not exist', () => {
      expect(() => i18n.t('ssss', {}, testLocale)).to.throw()
    })
    it('should get values recursively', () => {
      expect(
        i18n.t('instructions.type', {key: 'Shift', name: 'Ross'}, testLocale)
      ).to.equal(`Press the Shift key on the keyboard, Ross`)
    })
    it('should get values recursively several levels deeps', () => {
      expect(
        i18n.t('instructions.speak.angrily.at_self', {name: 'Ross'}, testLocale)
      ).to.equal(`WHY AM I SUCH A FOOL, Ross?!?!`)
    })
    it('is cool with colons in translation names', () => {
      expect(
        i18n.t('instructions.karate:chop', {}, testLocale)
      ).to.equal(`Hi-YA!`)
    })
  })
});
