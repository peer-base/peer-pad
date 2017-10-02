import React, { Component } from 'react'
import PropTypes from 'prop-types'

const GATEWAY_PREFIX = 'https://gateway.ipfs.io/ipfs/'

class Snapshots extends Component {
  constructor (props) {
    super(props)

    this.state = {
      snapshots: []
    }
  }

  render () {
    return (
      <div className='panel panel-default'>
        <div className='panel-heading'>
          <h3 className='panel-title'>Snapshots
            <button className='button' onClick={this.handleSnap.bind(this)}>Snap</button>
          </h3>
        </div>
        <div className='panel-body'>
          <ul className='list-unstyled' style={{fontSize: '50%'}}>
            {
              this.state.snapshots.map((ss, index) => {
                const url = GATEWAY_PREFIX + ss.hash + '#' + ss.key
                return (<li key={index}><a href={url}>{ss.hash}</a></li>)
              })
            }
          </ul>
        </div>
      </div>
    )
  }

  async handleSnap () {
    const newSnapshot = await this.props.takeSnapshot()
    if (newSnapshot) {
      this.setState({
        snapshots: [newSnapshot, ...this.state.snapshots]
      })
    }
  }
}

Snapshots.propTypes = {
  takeSnapshot: PropTypes.func.isRequired
}

export default Snapshots
