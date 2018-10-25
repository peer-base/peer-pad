'use strict'

const ms = require('milliseconds')
const injectConfig = require('./inject-config')
const replicaAddTextBehavior = require('./replica-add-text-behavior')
const replicaChangeTextBehavior = require('./replica-change-text-behavior')

module.exports = ({events, text}) => async ({ page, data: url, worker }) => {
  try {
    await injectConfig(page)
    page.setDefaultNavigationTimeout(120000)
    await page.goto(url)
    page.on('console', (m) => events.emit('message', `[worker ${worker.id}]: ${m.text()}`))
    await page.waitForSelector('[data-id=ipfs-status][data-value=online]', {timeout: ms.minutes(2)})
    await replicaAddTextBehavior({page, worker, text})
    await replicaChangeTextBehavior({page, worker, text: text.mutable()})
  } catch (err) {
    console.error(`error in worker ${worker.id}:`, err)
    throw err
  }
}
