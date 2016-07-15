module.exports = {
  respondWith: (attrs) => {
    return Object.assign({}, {
      date: new Date(),
      id: Date.now().toString(),
      position: 'left',
      sentiment: 'friendly',
      name: "String",
    }, attrs)
  }
}
