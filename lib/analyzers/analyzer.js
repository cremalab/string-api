const S = require('string')

const minimumOccuranceCount = 1

class Analyzer {
  constructor() {
    this.minimumOccuranceCount = minimumOccuranceCount
  }
  analyze(content) {
    return this.getTags(content).sort((m,t) => m.count<=t.count).map(t => t.tag)
  }

  getTags(content) {
    this.content = content
    this.words   = content.split(' ').map(w => w.toLowerCase())
    let tags = this.tags.reduce((matchedTags, tag) => {
      let occurances = tag.keywords.map((k) => {
        return {word: k, count: S(content).count(k)}
      }).filter((k) => {
        return k.count > 0
      }).reduce((mem, k) => {
        return mem + k.count
      }, 0)
      return matchedTags.concat({tag: tag.tag, count: occurances})
    }, []).filter(t => t.count >= this.minimumOccuranceCount)
    return tags
  }

}
module.exports = Analyzer
