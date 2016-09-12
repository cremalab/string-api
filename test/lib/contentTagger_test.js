'use strict'
const contentTagger = require('../../lib/contentTagger')
const expect   = require('chai').expect

const foodTest = `Ate some extremely spicy veggie curry`

describe.only('contentTagger', function() {
  describe('determineTags', () => {
    it('should return array of tags', () => {
      expect(contentTagger.determineTags(foodTest)).to.be.an('array')
    })
    it('match within its category', () => {
      expect(contentTagger.determineTags(foodTest, 'eat').length).to.be.greaterThan(0)
      expect(contentTagger.determineTags(foodTest, 'see').length).to.be.lessThan(1)
    })
    it('should only return relevant tags', () => {
      let tags = contentTagger.determineTags(`Ate a bland hamburger `, 'eat')
      expect(tags).to.not.contain('vegetarian')
      expect(tags).to.not.contain('vegan')
    })
  })
})
