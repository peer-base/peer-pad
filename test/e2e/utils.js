'use strict'

/* global expect */

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
  catchPageErrors(page)
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

let padUrl

export async function createAndPreparePad () {
  const page = await createPage()

  if (!padUrl) {
    await createNewPad(page)
    padUrl = page.url()
    console.log('padUrl', padUrl)
  } else {
    page.goto(padUrl)
  }

  const peerId = await waitForPeerId(page)
  console.log('peerId', peerId)
  expect(peerId).toBeTruthy()

  await page.evaluate(() => { // inject jquery
    const s = document.createElement('script')
    s.src = 'https://code.jquery.com/jquery-3.3.1.min.js'
    document.body.appendChild(s)
  })

  return page
}

export function catchPageErrors (page) {
  const errors = []
  page.on('error', err => errors.push(err.message)) // Emitted when the page crashes.
  page.on('pageerror', err => errors.push(err.message)) // Emitted when an uncaught exception happens within the page.
  page.on('requestfailed', req => {
    errors.push(`${req.failure().errorText} ${req.url()}`)
  })
  page.on('response', res => {
    if (res.status() >= 400) {
      errors.push(`${res.status()} ${res.url()}`)
    }
  })

  page.expectNoError = () => {
    errors.forEach(err => console.log(err))
    expect(errors.length).toBe(0)
  }
  page.errors = errors
}

export function cleanup () {
  afterEach(() => {
    browsers.forEach(b => b.close())
  })
}
