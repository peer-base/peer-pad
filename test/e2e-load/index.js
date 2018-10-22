'use strict'

const spawnCluster = require('./spawn-cluster')

;(async () => {
  const cluster = await spawnCluster()

  cluster.on('message', (m) => {
    console.log(m)
  })

  cluster.once('bootstrapped', () => {
    console.log('bootstrapped')
  })

  cluster.once('ended', () => {
    console.log('ended')
    cluster.close()
  })
})()
