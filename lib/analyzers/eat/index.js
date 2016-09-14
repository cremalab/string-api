const Analyzer  = require('../analyzer')
const drinkTags = require('../drink/index').tags

const tags = [
  {
    tag: 'vegetarian',
    keywords: [
      'veggie', 'vegetarian', 'meatless', 'meat-free', 'vegan', 'veg', 'bocca',
      'tofu'
    ]
  },
  {
    tag: 'vegan',
    keywords: [
      'vegan'
    ]
  },
  {
    tag: 'spicy',
    keywords: [
      'spicy', 'hot', 'blazing', 'scoval'
    ]
  },
  {
    tag: 'paleo',
    keywords: [
      'paleo', 'raw', 'whole30'
    ]
  }
]

class EatAnalyzer extends Analyzer {
  constructor() {
    super()
    this.tags = tags.concat(drinkTags)
  }
}

module.exports = EatAnalyzer
