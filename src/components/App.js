import React, { Component } from 'react'

import { HashRouter as Router, Route } from 'react-router-dom'

import Home from './home/Home'
import Edit from './Edit'

class App extends Component {
  render () {
    return (
      <Router>
        <div>
          <Route exact path='/' component={Home} />
          <Route exact path='/w/:type/:name/:readKey/:writeKey' render={this.renderEditor.bind(this)} />
          <Route exact path='/c/:type/:name/:readKey/:encryptedWriteKey' render={this.getWriteKeyAndRedirect.bind(this)} />
          <Route path='/r/:type/:name/:readKey' render={this.renderEditor.bind(this)} />
        </div>
      </Router>
    )
  }

  renderEditor (props) {
    return (<Edit backend={this._backend} onBackend={this.onBackend.bind(this)} {...props} />)
  }

  getWriteKeyAndRedirect (props) {
    props.match.params.encryptedWriteKey
  }

  onBackend (backend) {
    this._backend = backend
  }
}

export default App
