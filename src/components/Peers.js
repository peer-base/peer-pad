import React, { Component } from 'react';
import PropTypes from 'prop-types'

class Peers extends Component {

  render () {
    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">Peers</h3>
        </div>
        <div className="panel-body">
          <ul id="peers" className="list-unstyled" style={{fontSize: '50%'}}>
            {this.props.peers.map((peer) => <li key={peer}>{peer}</li>)}
          </ul>
        </div>
      </div>
    )
  }
}

Peers.propTypes = {
  peers: PropTypes.arrayOf(PropTypes.string).isRequired
}

export default Peers
