import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Links extends Component {
  render () {
    return (
      <div className='panel panel-default'>
        <div className='panel-heading'>
          <h3 className='panel-title'>Share links</h3>
        </div>
        <div className='panel-body'>
          <ul id='peers' className='list-unstyled'>
            <li><a href={'/w/' + this.props.keys.read + '/' + this.props.keys.write}>Writable</a></li>
            <li><a href={'/r/' + this.props.keys.read}>Read-only</a></li>
          </ul>
        </div>
      </div>
    )
  }
}

Links.propTypes = {
  keys: PropTypes.shape(
    {
      read: PropTypes.string.isRequired,
      write: PropTypes.string
    }
  ).isRequired
}

export default Links
