'use strict'

const ms = require('milliseconds')
const Replica = require('./replica')
const replicaAddTextBehavior = require('./replica-add-text-behavior')
const replicaChangeTextBehavior = require('./replica-change-text-behavior')
const Text = require('./text')
const injectConfig = require('./inject-config')

module.exports = ({cluster, replicaCount, events}) => {
  return async ({ page, data: url, worker }) => {
    try {
      await injectConfig(page)
      page.setDefaultNavigationTimeout(120000)
      await page.goto(url)
      page.on('console', (m) => events.emit('message', `[bootstrapper]: ${m.text()}`))
      replicaCount-- // self
      let workerId = 1

      const padURL = await createNewPad()
      console.log('padURL:', padURL)

      const text = Text()

      const replicas = []

      while (replicaCount > 0) {
        const replica = cluster.queue(padURL, Replica({ events, text: text.forReplica(workerId) }))
        replicas.push(replica)
        replicaCount --
        workerId ++
      }

      const myText = text.forReplica(0)
      await replicaAddTextBehavior({page, worker, text: myText})

      Promise.all(replicas).then(() => events.emit('ended'))

      let valid = false
      try {
        await text.results()
        valid = true
      } catch (err) {
        console.error('Error in evaluating results:', err.message)
        console.error(err)
      }

      if (valid) {
        console.log('ALL GOOD so far! :)')
      }

      await replicaChangeTextBehavior({page, worker, text: myText.all()})
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

