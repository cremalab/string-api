const Analyzer = require('../analyzer')

const tags = [
  {
    tag: 'cocktail',
    keywords: [
      'cocktail', 'mixed drink'
    ]
  }
]

class DrinkAnalyzer extends Analyzer {
  constructor() {
    super()
    this.tags = tags
  }
}

module.exports = DrinkAnalyzer
