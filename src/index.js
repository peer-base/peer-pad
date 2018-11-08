import rollbar from 'rollbar-browser'
import React from 'react'
import ReactDOM from 'react-dom'
// TODO: register service worker:
// import registerServiceWorker from './registerServiceWorker'
import 'tachyons/css/tachyons.css'
import 'tachyons-flexbox/css/tachyons-flexbox.css'
import 'tachyons-forms/css/tachyons-forms.css'
import './index.styl'

import App from './components/App'

const rollbarConfig = {
  // Only enable error reporting if user is loading the website via peerpad.net
  enabled: window.location.hostname === 'peerpad.net',
  accessToken: '2eaed8c2c5e243af8497d15ea90b407e',
  captureUncaught: true,
  captureUnhandledRejections: true,
  payload: {
    environment: process.env.NODE_ENV
  }
}
const Rollbar = rollbar.init(rollbarConfig)
window.Rollbar = Rollbar


ReactDOM.render(<App />, document.getElementById('root'))
// registerServiceWorker()
