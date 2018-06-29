'use strict'

/* eslint-env mocha */

import puppeteer from 'puppeteer'
import ms from 'milliseconds'

// Which deployment to run the tests against
const appUrl = process.env.URL || 'http://localhost:3000'
const debug = process.env.DEBUG === 'true'

// puppeteer.launch opts
// see: https://github.com/GoogleChrome/puppeteer/blob/v1.3.0/docs/api.md#puppeteerlaunchoptions
const headless = !debug
const slowMo = debug ? 100 : undefined
const noSandbox = process.env.NO_SANDBOX === 'true'
const args = noSandbox ? ['--no-sandbox'] : undefined

// track browser instances so we can close them all after the test.
let browsers = []

export async function createBrowser () {
  const browser = await puppeteer.launch({headless, slowMo, args})
  browsers.push(browser)
  return browser
}

export async function createPage () {
  const browser = await createBrowser()
  const page = await browser.newPage()
  // See: https://github.com/GoogleChrome/puppeteer/issues/1183#issuecomment-383722137
  await page._client.send('Emulation.clearDeviceMetricsOverride')
  return page
}

export async function createNewPad (page) {
  await page.goto(appUrl)
  await page.waitForSelector('[data-id=start-button]')
  await page.click('[data-id=start-button]')
  // wait for IPFS to boot
  await page.waitForSelector('[data-id=ipfs-status][data-value=online]', {timeout: ms.minutes(2)})
}

export async function waitForPeerId (page) {
  // wait for IPFS to boot
  await page.waitForSelector('[data-peer-id]', {timeout: ms.minutes(2)})
  const peersButton = await page.$('[data-peer-id]')
  const peerId = await page.evaluate(el => el.dataset.peerId, peersButton)
  return peerId
}

export function cleanup () {
  afterEach(() => {
    browsers.forEach(b => b.close())
  })
}
