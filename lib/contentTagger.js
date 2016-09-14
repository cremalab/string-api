const analyzers = require('./analyzers')

const parseAndTag = (object, content, category) => {
  let tags = determineTags(content, category)
  object.tags = [ ...new Set( object.tags.concat( ...tags ) ) ]
  return object
}
const determineTags = (content, category) => {
  return analyzers.analyze(content, category)
}

module.exports = {
  parseAndTag: parseAndTag,
  determineTags: determineTags
}
