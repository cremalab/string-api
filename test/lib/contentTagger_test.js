'use strict'
const contentTagger = require('../../lib/contentTagger')
const expect        = require('chai').expect
const keystone      = require('keystone')
const Tagger        = keystone.list('Tagger')

const foodTest = `Ate some extremely spicy veggie curry`

describe('contentTagger', function() {
  before(() => {
    return new Tagger.model({
      tag: 'vegetarian', activity_types: [`eat`, 'drink'], keywords: [
        `veggie`, `vegetarian`, `vegan`
      ]
    }).save()
  })
  describe('determineTags', () => {
    it('should return array of tags', () => {
      expect(contentTagger.determineTags(foodTest)).to.eventually.be.an('array')
    })
    it('match within its category', () => {
      return contentTagger.determineTags(foodTest, 'eat').then((tags) => {
        expect(tags.length).to.be.greaterThan(0)
        return contentTagger.determineTags(foodTest, 'see')
      }).then((tags) => {
        return expect(tags.length).to.be.lessThan(1)
      })
    })
    it('should only return relevant tags', () => {
      contentTagger.determineTags(`Ate a bland hamburger `, 'eat').then((tags) => {
        expect(tags).to.not.contain('vegetarian')
        expect(tags).to.not.contain('vegan')
      })
    })
  })
})
