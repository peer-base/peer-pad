'use strict'

const EventEmitter = require('events')
const { Cluster } = require('puppeteer-cluster');
const Bootstrap = require('./bootstrap')
// const printErrors = require('./print-errors')

module.exports = async ({ replicaCount = 10, baseURL = 'http://localhost:1337' } = {}) => {
  const events = new EventEmitter()

  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_BROWSER,
    maxConcurrency: replicaCount,
    workerCreationDelay: 100,
    monitor: false,
    puppeteerOptions: {
      headless: false,
      timeout: 120000
    }
  })

  events.close = () => cluster.close()
  events.systemMonitor = cluster.systemMonitor

  cluster.queue(baseURL, Bootstrap({cluster, replicaCount, events})).then(() => {
    events.emit('bootstrapped')
  })

  cluster.idle().then(() => events.emit('ended'))

  return events
}


  // many more pages
