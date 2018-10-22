'use strict'

const replica = require('./replica')

module.exports = ({cluster, replicaCount}) => {
  return async ({ page, data: url }) => {
    await page.goto(url)
    replicaCount-- // self
    while (replicaCount > 0) {
      cluster.queue(url + '/' + replicaCount, replica)
      replicaCount--
    }
  }
}
