'use strict'

const ms = require('milliseconds')
const Replica = require('./replica')
const replicaBehavior = require('./replica-behavior')
const Text = require('./text')

module.exports = ({cluster, replicaCount, events}) => {
  return async ({ page, data: url, worker }) => {
    try {
      page.setDefaultNavigationTimeout(120000)
      await page.goto(url)
      page.on('console', (m) => events.emit('message', `[bootstrapper]: ${m.text()}`))
      replicaCount-- // self
      let workerId = 1

      const padURL = await createNewPad()
      console.log('padURL:', padURL)

      const text = Text()

      const me = replicaBehavior({page, worker, text: text.forReplica(0)})

      const replicas = []

      while (replicaCount > 0) {
        const replica = cluster.queue(padURL, Replica({ events, text: text.forReplica(workerId) }))
        replicas.push(replica)
        replicaCount --
        workerId ++
      }

      await me

      console.log('=> BOOTSRAP DOOONE')

      Promise.all(replicas).then(() => events.emit('ended'))

      await text.results()

      console.log('ALL GOOD! :)')
    } catch (err) {
      console.error(`error in worker ${worker.id}:`, err)
      throw err
    }

    async function createNewPad () {
      console.log('going to create new pad...')
      await page.waitForSelector('[data-id=start-button]')
      await page.click('[data-id=start-button]')
      // wait for IPFS to boot
      await page.waitForSelector('[data-id=ipfs-status][data-value=online]', {timeout: ms.minutes(2)})
      console.log('created new pad', page.url())
      return page.url()
    }
  }
}

