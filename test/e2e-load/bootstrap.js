'use strict'

const ms = require('milliseconds')
const Replica = require('./replica')
const replicaAddTextBehavior = require('./replica-add-text-behavior')
const replicaChangeTextBehavior = require('./replica-change-text-behavior')
const InsertOnlyText = require('./text/insert-only-text')
const injectConfig = require('./inject-config')
const ReadOnlyReplica = require('./read-only-replica')

module.exports = ({cluster, replicaCount, events, pinnerSpawner}) => {
  return async ({ page, data: url, worker }) => {
    let pinner

    try {
      await injectConfig(page)
      page.setDefaultNavigationTimeout(120000)
      await page.goto(url)
      page.on('console', (m) => events.emit('message', `[bootstrapper]: ${m.text()}`))
      replicaCount-- // self
      let workerId = 1
      let workerPendingEnd = 0

      events.on('worker ended', () => {
        workerPendingEnd --
        if (!workerPendingEnd) {
          events.emit('all workers ended')
        }
      })

      const allWorkersEnded = () => {
        return new Promise((resolve, reject) => {
          if (!workerPendingEnd) {
            return resolve()
          }
          events.once('all workers ended', resolve)
        })
      }

      const padURL = await createNewPad()
      console.log('padURL:', padURL)

      const text = InsertOnlyText()

      const replicas = []

      if (pinnerSpawner) {
        console.log('spawning pinner...')
        pinner = await pinnerSpawner()
        console.log('spawned pinner.')
      }

      while (replicaCount > 0) {
        const replica = cluster.queue(padURL, Replica({ events, text: text.forReplica(workerId) }))
        replicas.push(replica)
        workerPendingEnd ++
        replicaCount--
        workerId++
      }

      const myText = text.forReplica(0)
      await replicaAddTextBehavior({page, worker, text: myText})

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
      } else {
        throw new Error('append-only text validation failed!')
      }

      const mutableText = myText.mutable()

      await replicaChangeTextBehavior({page, worker, text: mutableText})

      valid = false
      try {
        await mutableText.validate()
        valid = true
      } catch (err) {
        console.error('Error in evaluating results:', err.message)
        console.error(err)
      }

      if (valid) {
        console.log('ALL GOOD! :)')
      } else {
        throw new Error('mutable text validation failed!')
      }

      // validate that pinner got the latest state
      if (pinner) {
        await allWorkersEnded()
        console.log('all workers ended')
        const readOnlyReplica = ReadOnlyReplica({ events })
        cluster.queue(padURL, readOnlyReplica)
        const result = await events.waitFor('worker ended')
        console.log('read-only replica result:', result)
        if (result !== mutableText.getFinal()) {
          throw new Error('read-only text is not the expected final mutable text')
        } else {
          console.log('read-only text looks OK :)')
        }
        events.emit('ended')
      }
    } catch (err) {
      console.error(`error in worker ${worker.id}:`, err)
      throw err
    }

    if (pinner) {
      pinner.kill()
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
