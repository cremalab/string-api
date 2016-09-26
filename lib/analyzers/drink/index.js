const Analyzer = require('../analyzer')

class DrinkAnalyzer extends Analyzer {
  constructor() {
    super()
    this.activity_type = 'drink'
  }
}

module.exports      = DrinkAnalyzer
