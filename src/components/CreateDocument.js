import encodeKey from '../keys/uri-encode'
import generateKeys from '../keys/generate'

import React, { Component } from 'react'
import { Button } from 'react-bootstrap'
import { Redirect } from 'react-router-dom'

class CreateDocument extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    if (this.state.redirect) {
      return (<Redirect to={this.state.redirect} push={true} />)
    }

    return (
      <Button bsSize='large'
        onClick={this.handleClick.bind(this)}>
        Create new Document
      </Button>
    )
  }

  async handleClick () {
    const keys = await generateKeys()
    const url = '/w/' + encodeKey(keys.public) + '/' + encodeKey(keys.private)
    this.setState({redirect: url})
  }
}

export default CreateDocument
