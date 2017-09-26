import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Peers extends Component {
  constructor (props) {
    super(props)
    this.state = {
      peers: {}
    }

    props.peers.on('change', () => {
      this.setState({ peers: props.peers.all() })
    })
  }

  render () {
    return (
      <div className='panel panel-default'>
        <div className='panel-heading'>
          <h3 className='panel-title'>Peers</h3>
        </div>
        <div className='panel-body'>
          <ul id='peers' className='list-unstyled' style={{fontSize: '50%'}}>
            {Object.keys(this.state.peers).sort().map((peerId) => <li key={peerId}>{peerId}</li>)}
          </ul>
        </div>
      </div>
    )
  }
}

Peers.propTypes = {
  peers: PropTypes.object.isRequired
}

export default Peers
