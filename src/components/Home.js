import React, { Component } from 'react'
import './Home.css'
import CreateDocument from './CreateDocument'
import Warning from './home/Warning'

class Home extends Component {
  constructor (props) {
    super(props)
    this.state = {
      error: false,
      showWarning: true
    }
  }

  render () {
    let error
    if (this.state.error) {
      error = (<p>Error!</p>)
    }

    return (
      <div className='Home'>
        {this.state.showWarning && (
          <Warning onClose={() => this.setState({showWarning: false})} />
        )}
        <div className='Home-header'>
          <h2>Welcome to PeerPad</h2>
        </div>
        {error}
        <div className='Home-intro'>
          <CreateDocument />
        </div>
      </div>
    )
  }

  componentDidCatch (err, info) {
    this.setState({ error: err })
  }
}

export default Home
