const en = require('./locales/en')

module.exports = {
  t: (key, values) => {
    return Object.keys(values).reduce((mem, v) => {
      return mem.replace(`{${v}}`, values[v])
    }, en[key])
  }
}
