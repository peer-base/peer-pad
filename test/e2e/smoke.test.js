/* global it afterEach expect */
import puppeteer from 'puppeteer'
import ms from 'milliseconds'

// Which deployment to run the tests against
const appUrl = process.env.URL || 'http://localhost:3000'
const debug = process.env.DEBUG === 'true'

console.log('Testing', appUrl)

// puppeteer.launch opts
// see: https://github.com/GoogleChrome/puppeteer/blob/v1.3.0/docs/api.md#puppeteerlaunchoptions
const headless = !debug
const slowMo = debug ? 100 : undefined
const noSandbox = process.env.NO_SANDBOX === 'true'
const args = noSandbox ? ['--no-sandbox'] : undefined

// track browser instances so we can close them all after the test.
let browsers = []

async function createBrowser () {
  const browser = await puppeteer.launch({headless, slowMo, args})
  browsers.push(browser)
  return browser
}

afterEach(() => {
  browsers.forEach(b => b.close())
})

it('Create a pad', async (done) => {
  try {
    const user = await createTabForUser('user')
    const errors = []
    user.on('error', err => errors.push(err))
    user.on('pageerror', err => errors.push(err))
    await createNewPad(user)
    const peerId = await findPeerId(user)
    console.log('peerId', peerId)
    expect(peerId).toBeTruthy()
    expect(peerId.length).toBeGreaterThan(10)
    expect(errors.length).toBe(0)
  } catch (err) {
    return done.fail(err)
  }
  done()
}, ms.minutes(1))

it('synchronises two pads via IPFS', async (done) => {
  try {
    const alf = await createTabForUser('alf')
    await createNewPad(alf)
    const alfPeerId = await findPeerId(alf)
    expect(alfPeerId).toBeTruthy()
    const alfTitle = 'I R ROBOT'
    await alf.type('[data-id=document-title-input]', alfTitle)

    const bob = await createTabForUser('bob')
    console.log('pad url', alf.url())
    await bob.goto(alf.url())
    const bobPeerId = await findPeerId(bob)
    expect(bobPeerId).toBeTruthy()
    expect(bobPeerId).not.toEqual(alfPeerId)
    console.log('alf peerId', alfPeerId)
    console.log('bob peerId', bobPeerId)
    // wait for IPFS to sync...
    const waitFor = ms.seconds(5)
    setTimeout(async () => {
      try {
        const bobTitle = await getDocumentTitle(bob)
        expect(bobTitle).toEqual(alfTitle)
      } catch (err) {
        done.fail(err)
      }
      done()
    }, waitFor)
  } catch (err) {
    done.fail(err)
  }
}, ms.minutes(3)) // spinning up 2 browsers and syncing pads can take a while.

async function getDocumentTitle (page) {
  await page.waitForSelector('[data-id=document-title-input]')
  const titleEl = await page.$('[data-id=document-title-input]')
  return page.evaluate(el => el.value, titleEl)
}

async function createNewPad (page) {
  await page.goto(appUrl)
  await page.waitForSelector('[data-id=start-button]')
  await page.click('[data-id=start-button]')
  // wait up to 1 minute for IPFS to boot
  await page.waitForSelector('[data-id=ipfs-status][data-value=online]', {timeout: ms.minutes(1)})
}

async function findPeerId (page) {
  // wait up to 1 minute for IPFS to boot
  await page.waitForSelector('[data-peer-id]', {timeout: ms.minutes(1)})
  const peersButton = await page.$('[data-peer-id]')
  const peerId = await page.evaluate(el => el.dataset.peerId, peersButton)
  return peerId
}

async function createTabForUser (username) {
  const browser = await createBrowser()
  const page = await browser.newPage()
  // See: https://github.com/GoogleChrome/puppeteer/issues/1183#issuecomment-383722137
  await page._client.send('Emulation.clearDeviceMetricsOverride')
  // page.on('console', msg => console.log(`${username} console:`, msg.text()))
  return page
}
