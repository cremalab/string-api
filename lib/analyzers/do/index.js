const Analyzer = require('../analyzer')

const tags = [

]

class DoAnalyzer extends Analyzer {
  constructor() {
    super()
    this.tags = tags
  }
}

module.exports = DoAnalyzer
