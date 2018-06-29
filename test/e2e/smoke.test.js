'use strict'

/* global expect */
/* eslint-env mocha */

import ms from 'milliseconds'
import {createPage, createNewPad, waitForPeerId, cleanup} from './utils'

afterEach(() => {
  cleanup()
})

it('creates a pad', async () => {
  const page = await createPage()

  // Catch any errors
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

  // Create a pad and wait for IPFS to init.
  await createNewPad(page)
  const peerId = await waitForPeerId(page)
  console.log('peerId', peerId)

  expect(peerId).toBeTruthy()
  expect(peerId.length).toBeGreaterThan(10)
  errors.forEach(err => console.log(err))
  expect(errors.length).toBe(0)
}, ms.minutes(3))

it('synchronises two pads via IPFS', async () => {
  const docTitleSelector = '[data-id=document-title-input]'

  const alf = await createPage()
  await createNewPad(alf)
  const alfPeerId = await waitForPeerId(alf)
  console.log('alf peerId', alfPeerId)
  expect(alfPeerId).toBeTruthy()
  const alfTitle = 'I R ROBOT'
  await alf.type(docTitleSelector, alfTitle)
  const padUrl = alf.url()
  console.log('pad url', padUrl)

  const bob = await createPage()
  await bob.goto(padUrl)
  const bobPeerId = await waitForPeerId(bob)
  expect(bobPeerId).toBeTruthy()
  expect(bobPeerId).not.toEqual(alfPeerId)
  console.log('bob peerId', bobPeerId)

  // Wait for bob's doc title to match alf's
  const bobTitleRef = await bob.$(docTitleSelector)
  const valueMatches = (input, expected) => input.value === expected
  // waitFor fn is executed in the browser context, so context has to passed as args.
  await bob.waitFor(valueMatches, {/* opts */}, bobTitleRef, alfTitle)
}, ms.minutes(6)) // spinning up 2 browsers and syncing pads can take a while.
