const analyzers = require('./analyzers')

const parseAndTag = (object, content, category) => {
  return determineTags(content, category).then((tags) => {
    object.tags = [ ...new Set( object.tags.concat( ...tags ) ) ]
    return object
  })
}
const determineTags = (content, category) => {
  return analyzers.analyze(content, category)
}

module.exports = {
  parseAndTag: parseAndTag,
  determineTags: determineTags
}
