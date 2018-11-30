'use strict'

const ms = require('milliseconds')
const injectConfig = require('./inject-config')
const replicaAddTextBehavior = require('./replica-add-text-behavior')
const replicaChangeTextBehavior = require('./replica-change-text-behavior')

module.exports = ({events, coolDownMS = 30000}) => async ({ page, data: url, worker }) => {
  try {
    console.log('starting new read only replica')
    await injectConfig(page)
    page.setDefaultNavigationTimeout(120000)
    await page.goto(url)
    page.on('console', (m) => events.emit('message', `[worker ${worker.id}]: ${m.text()}`))
    await page.waitForSelector('[data-id=ipfs-status][data-value=online]', {timeout: ms.minutes(2)})
    await page.waitFor(coolDownMS)
    const result = await page.evaluate(() => {
      console.log('reading new replica editor value...')
      return window.__peerPadEditor.getValue()
    })
    events.emit('worker ended', result)
  } catch (err) {
    console.error(`error in worker ${worker.id}:`, err)
    throw err
  }
}
