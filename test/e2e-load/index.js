'use strict'

const build = require('./build')
const spawnServer = require('./spawn-server')
const spawnCluster = require('./spawn-cluster')

let server

console.log('Going to test the most recent build...')

process.once('uncaughtException', (err) => {
  if (server) {
    server.kill()
  }
  throw err
})

;(async () => {
  console.log('Building...')
  // await build()
  console.log('Built.')

  console.log('Spawning server...')
  server = await spawnServer()
  console.log('Spawned.')

  const cluster = await spawnCluster()

  cluster.on('message', (m) => {
    console.log(m)
  })

  cluster.once('bootstrapped', () => {
    console.log('bootstrapped')
  })

  cluster.once('ended', () => {
    console.log('ended')
    server.kill()
    cluster.close()
  })
})()
