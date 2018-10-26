'use strict'

const delay = require('delay')
const build = require('./build')
const spawnRelay = require('./spawn-relay')
const spawnServer = require('./spawn-server')
const spawnCluster = require('./spawn-cluster')

let relay
let server
let cluster

console.log('Going to test the most recent build...')

process.once('uncaughtException', (err) => {
  console.log(err)
  if (cluster) {
    cluster.close()
  }
  if (relay) {
    relay.kill()
  }
  if (server) {
    server.kill()
  }
  throw err
})

;(async () => {
  console.log('Building...')
  await build()
  console.log('Built.')

  console.log('Spawning relay...')
  relay = await spawnRelay()
  console.log('Spawned relay.')

  console.log('Spawning server...')
  server = await spawnServer()
  console.log('Spawned server.')

  cluster = await spawnCluster({replicaCount: 2})

  cluster.on('message', (m) => {
    console.log(m)
  })

  cluster.once('bootstrapped', () => {
    console.log('bootstrapped')
  })

  cluster.once('ended', async () => {
    console.log('ended')
    await cluster.idle()
    await delay(1000)
    relay.kill()
    server.kill()
    cluster.close()
  })
})()
