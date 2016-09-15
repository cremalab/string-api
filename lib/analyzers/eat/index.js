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
  },
  {
    tag: 'breakfast',
    keywords: [
      'breakfast', 'brunch', 'pancakes', 'waffles', 'eggs benedict', 'omlette',
      'omelette', 'scramble', 'bagel', 'donut', 'cereal', 'oatmeal', 'scone',
      'huevos', 'lox', 'muffin', 'nihari', 'pop-tart', 'pop tart', 'poptart',
      'quiche', 'biscuits and gravy', 'biscuits & gravy', 'B&G', 'mimosa',
      'bloody mary', 'bloody maria'
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
