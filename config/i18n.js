const en = require('./locales/en')
const R  = require('ramda')

const getDeepValue = R.curry((obj, key) => {
  return key.split('.').reduce((mem, seg) => {
    return mem[seg]
  }, obj)
})

module.exports = {
  t: (key, values = {}, locale) => {
    locale = locale || en
    translation = getDeepValue(locale)
    if (!translation(key)) throw new Error(`Translation ${key} does not exist`)
    return Object.keys(values).reduce((mem, v) => {
      return mem.replace(`{${v}}`, values[v])
    }, translation(key))
  }
}
