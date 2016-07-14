const en = require('./locales/en')

module.exports = {
  t: (key, values) => {
    console.log(en[key]);
    return Object.keys(values).reduce((mem, v) => {
      console.log(mem);
      return mem.replace(`{${v}}`, v)
    }, en[key])
  }
}
