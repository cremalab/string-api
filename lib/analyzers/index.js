const EatAnalyzer = require('./eat')
const DrinkAnalyzer = require('./drink')
const SeeAnalyzer = require('./see')
const DoAnalyzer = require('./do')

module.exports.analyze = (content, category) => {
  let analyzer
  switch (category) {
    case 'eat':
      analyzer = new EatAnalyzer()
      break
    case 'drink':
      analyzer = new DrinkAnalyzer()
      break
    case 'see':
      analyzer = new SeeAnalyzer()
      break
    case 'do':
      analyzer = new DoAnalyzer()
      break
    default:
      analyzer = new EatAnalyzer()
  }
  return analyzer.analyze(content)

}
