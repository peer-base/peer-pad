'use strict'

const EventEmitter = require('events')
const { Cluster } = require('puppeteer-cluster');
const Bootstrap = require('./bootstrap')

module.exports = async ({ replicaCount = 10, baseURL = 'http://localhost:1337' } = {}) => {
  const events = new EventEmitter()

  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_BROWSER,
    maxConcurrency: replicaCount,
    monitor: false
  })

  events.close = () => cluster.close()
  events.systemMonitor = cluster.systemMonitor

  const bootstrap = Bootstrap({cluster, replicaCount})
  cluster.queue(baseURL, bootstrap).then(() => {
    events.emit('bootstrapped')
  })

  cluster.idle().then(() => events.emit('ended'))

  return events
}


  // many more pages
