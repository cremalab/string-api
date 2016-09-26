const Analyzer = require('../analyzer')

class SeeAnalyzer extends Analyzer {
  constructor() {
    super()
    this.activity_type = 'see'
  }
}

module.exports = SeeAnalyzer
