import React, { Component } from 'react';
import PropTypes from 'prop-types'

class Status extends Component {

  render () {
    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">Status</h3>
        </div>
        <div className="panel-body">
          {this.props.status}
        </div>
      </div>
    )
  }
}

Status.propTypes = {
  status: PropTypes.string.isRequired
}

export default Status
