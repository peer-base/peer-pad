'use strict'

const ms = require('milliseconds')

module.exports = ({events}) => async ({ page, data: url, worker }) => {
  try {
    await page.goto(url)
    page.on('console', (m) => events.emit('message', `[worker ${worker.id}]: ${m.text()}`))
    await page.waitForSelector('[data-id=ipfs-status][data-value=online]', {timeout: ms.minutes(2)})
  } catch (err) {
    console.error(err)
    throw err
  }
}