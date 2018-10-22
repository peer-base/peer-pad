'use strict'

const ms = require('milliseconds')

const Replica = require('./replica')

module.exports = ({cluster, replicaCount, events}) => {
  return async ({ page, data: url }) => {
    try {
      await page.goto(url)
      page.on('console', (m) => events.emit('message', `[bootstrapper]: ${m.text()}`))
      replicaCount-- // self

      const padURL = await createNewPad()
      console.log('padURL:', padURL)

      while (replicaCount > 0) {
        cluster.queue(padURL, Replica(events))
        replicaCount--
      }
    } catch (err) {
      console.error(err)
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

