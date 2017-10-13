import React, { Component } from 'react'

import { HashRouter as Router, Route } from 'react-router-dom'

import PeerpadBackend from 'peerpad-core'

import Home from './Home'
import Edit from './Edit'

class App extends Component {

  constructor (props) {
    super(props)
    this._backend = PeerpadBackend()
  }

  render () {
    return (
      <Router>
        <div>
          <Route exact path='/' component={Home} />
          <Route exact path='/w/:type/:name/:readKey/:writeKey' render={props => <Edit backend={this._backend} {...props} />} />
          <Route path='/r/:type/:name/:readKey' render={props => <Edit backend={this._backend} {...props} />} />
        </div>
      </Router>
    )
  }
}

export default App
