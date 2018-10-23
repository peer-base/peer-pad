'use strict'

const config = require('./config')

module.exports = (page) => {
  const injectable = `
    Object.defineProperty(window, '__peerStarConfig', {
      get() {
        return ${JSON.stringify(config)}
      }
    })
  `
  return page.evaluateOnNewDocument(injectable)
}