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
    timeout: 3000000,
    // monitor: true,
    // puppeteerOptions: {
      // headless: false,
    //   // devtools: false,
      // timeout: 300000,
    //   // dumpio: true,
    //   // // handleSIGINT: false,
    //   // pipe: true
    // }
  })

  events.close = () => cluster.close()
  events.systemMonitor = cluster.systemMonitor
  events.idle = () => cluster.idle()

  cluster.on('taskerror', (err, data) => {
    events.emit('error', err)
  })

  cluster.queue(baseURL, Bootstrap({cluster, replicaCount, events})).then(() => {
    console.log('BOOTSTRAPPED')
    events.emit('bootstrapped')
  })

  return events
}


  // many more pages
