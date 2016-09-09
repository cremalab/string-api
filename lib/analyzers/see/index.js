const Analyzer = require('../analyzer')

const tags = [

]

class SeeAnalyzer extends Analyzer {
  constructor() {
    super()
    this.tags = tags
  }
}

module.exports = SeeAnalyzer
