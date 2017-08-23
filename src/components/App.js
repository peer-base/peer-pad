import React, { Component } from 'react';

import { BrowserRouter as Router, Route } from 'react-router-dom'

import Home from './Home'
import Edit from './Edit'

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" component={Home}/>
          <Route path="/:readKey/:writeKey" component={Edit}/>
        </div>
      </Router>
    )
  }
}

export default App;
