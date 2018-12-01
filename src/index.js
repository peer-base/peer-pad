import initRollbar from './rollbar'
import React from 'react'
import ReactDOM from 'react-dom'
// TODO: register service worker:
// import registerServiceWorker from './registerServiceWorker'
import 'tachyons/css/tachyons.css'
import 'tachyons-flexbox/css/tachyons-flexbox.css'
import 'tachyons-forms/css/tachyons-forms.css'
import './index.styl'

import App from './components/App'

// Initialize Rollbar first so we can catch all errors
const rollbar = initRollbar(window.location.hostname)
window.Rollbar = rollbar

ReactDOM.render(<App />, document.getElementById('root'))
// registerServiceWorker()
