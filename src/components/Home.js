import React, { Component } from 'react'
import './Home.css'
import CreateDocument from './CreateDocument'

class Home extends Component {
  constructor (props) {
    super(props)
    this.state = { error: false }
  }

  render () {
    let error
    if (this.state.error) {
      error = (<p>Error!</p>)
    }

    return (
      <div className='Home'>
        <div className='Home-header'>
          <h2>Welcome to PeerPad</h2>
        </div>
        {error}
        <p className='Home-intro'>
          <CreateDocument />
        </p>
      </div>
    )
  }

  componentDidCatch (err, info) {
    this.setState({ error: err })
  }
}

export default Home
