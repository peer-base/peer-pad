/* global it beforeAll afterAll expect */
import React from 'react'
import ReactDOM from 'react-dom'
import puppeteer from 'puppeteer'
import App from './App'

let browser = null

beforeAll(async () => {
  browser = await puppeteer.launch()
})

afterAll(() => {
  browser.close()
})

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<App />, div)
})

it('Edits in 1 pad appear in an other', async () => {
  const alf = await browser.newPage()
  await createNewPad(alf)
  const alfTitle = 'I R ROBOT'
  await alf.type('[data-id=document-title-input]', alfTitle)
  const bob = await browser.newPage()
  await bob.goto(alf.url())
  const bobTitle = await getDocumentTitle(bob)
  expect(bobTitle).toEqual(alfTitle)
}, 80000)

async function getDocumentTitle (page) {
  const titleEl = await page.$('[data-id=document-title-input]')
  return page.evaluate(el => el.value, titleEl)
}

async function createNewPad (page) {
  page.on('console', msg => console.log(`${username} console`, msg.text()))
  await page.goto('http://localhost:3000')
  await page.waitForSelector('[data-id=start-button]')
  await page.click('[data-id=start-button]')
  await page.waitForSelector('[data-id=ipfs-status][data-value=online]')
  await page.waitForSelector('[data-peer-id]')
  const peersButton = await page.$('[data-peer-id]')
  const peerId = await page.evaluate(el => el.dataset.peerId, peersButton)
  return page
}
