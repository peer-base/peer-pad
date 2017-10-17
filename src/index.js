import React from 'react'
import ReactDOM from 'react-dom'
// TODO: register service worker:
// import registerServiceWorker from './registerServiceWorker'
import 'tachyons/css/tachyons.css'
import 'tachyons-flexbox/css/tachyons-flexbox.css'
import 'tachyons-forms/css/tachyons-forms.css'
import './index.css'

import App from './components/App'

ReactDOM.render(<App />, document.getElementById('root'))
// registerServiceWorker()
