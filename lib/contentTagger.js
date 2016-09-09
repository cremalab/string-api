const analyzers = require('./analyzers')

const parseAndTag = (object, content, category) => {
  let tags = determineTags(content, category)
  return object.update({tags: tags})
}
const determineTags = (content, category) => {
  return analyzers.analyze(content, category)
}

module.exports = {
  parseAndTag: parseAndTag,
  determineTags: determineTags
}
