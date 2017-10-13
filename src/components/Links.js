import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

class Links extends Component {
  render () {
    const type = encodeURIComponent(this.props.type)
    const name = encodeURIComponent(this.props.name)
    return (
      <div className='panel panel-default'>
        <div className='panel-heading'>
          <h3 className='panel-title'>Share links</h3>
        </div>
        <div className='panel-body'>
          <ul id='peers' className='list-unstyled'>
            <li><Link to={'/w/' + type + '/' + name + '/' + this.props.keys.read + '/' + this.props.keys.write}>Writable</Link></li>
            <li><Link to={'/r/' + type + '/' + name + '/' + this.props.keys.read}>Read-only</Link></li>
          </ul>
        </div>
      </div>
    )
  }
}

Links.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  keys: PropTypes.shape(
    {
      read: PropTypes.string.isRequired,
      write: PropTypes.string
    }
  ).isRequired
}

export default Links
