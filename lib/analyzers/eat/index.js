const Analyzer  = require('../analyzer')

class EatAnalyzer extends Analyzer {
  constructor() {
    super()
    this.activity_type = 'eat'
  }
}

module.exports = EatAnalyzer
