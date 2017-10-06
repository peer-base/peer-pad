import React, { Component } from 'react'

import { BrowserRouter as Router, Route } from 'react-router-dom'

import Home from './Home'
import Edit from './Edit'

class App extends Component {
  render () {
    return (
      <Router>
        <div>
          <Route exact path='/' component={Home} />
          <Route exact path='/w/:type/:name/:readKey/:writeKey' component={Edit} />
          <Route path='/r/:type/:name/:readKey' component={Edit} />
        </div>
      </Router>
    )
  }
}

export default App
