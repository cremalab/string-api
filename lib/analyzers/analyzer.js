const S        = require('string')
const Tagger = require('../../models/tagger')

const minimumOccuranceCount = 1

class Analyzer {
  constructor(activity_type) {
    this.activity_type         = activity_type
    this.minimumOccuranceCount = minimumOccuranceCount
  }
  analyze(content) {
    return this.getTags(content).then((tags) => {
      return tags.sort((m,t) => m.count<=t.count).map(t => t.tag)
    })
  }

  getTags(content) {
    this.content = content
    this.words   = content.split(' ').map(w => w.toLowerCase())

    return Tagger.model.where('activity_types').in([this.activity_type]).then((taggers) => {
      const tags = taggers.reduce((mem, tag) => {
        let occurances = tag.keywords.map((k) => {
          return {word: k, count: S(content).count(k)}
        }).filter((k) => {
          return k.count > 0
        }).reduce((mem, k) => {
          return mem + k.count
        }, 0)
        return mem.concat({tag: tag.tag, count: occurances}
      )}, []
      ).filter(t => t.count >= this.minimumOccuranceCount)
      return tags
    })

  }

}
module.exports = Analyzer
