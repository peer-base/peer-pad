import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Status extends Component {
  render () {
    return (
      <div className='dib white' title='Your IPFS network connection status'>
        <span className='f6 fw1'>Status: </span>
        <span className='f6 fw4'>{this.props.status}</span>
      </div>
    )
  }
}

Status.propTypes = {
  status: PropTypes.string.isRequired
}

export default Status
