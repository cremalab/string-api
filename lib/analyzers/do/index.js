const Analyzer = require('../analyzer')

class DoAnalyzer extends Analyzer {
  constructor() {
    super()
    this.activity_type = 'do'
  }
}

module.exports = DoAnalyzer
