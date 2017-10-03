import { generateRandomKeys } from 'peerpad-core'

import React, { Component } from 'react'
import { Button, FormGroup, FormControl } from 'react-bootstrap'
import { Redirect } from 'react-router-dom'

class CreateDocument extends Component {
  constructor (props) {
    super(props)
    this.state = {
      name: ''
    }
  }

  render () {
    if (this.state.redirect) {
      return (<Redirect to={this.state.redirect} push />)
    }

    return (
      <form>
        <FormGroup>
          <FormControl
            type='text'
            value={this.state.name}
            placeholder='pad name'
            onChange={this.handleNameChange.bind(this)} />

          <Button bsSize='large'
            onClick={this.handleClick.bind(this)}>
            Create new Document
          </Button>

          <FormControl.Feedback />
        </FormGroup>
      </form>
    )
  }

  handleNameChange (event) {
    this.setState({name: event.target.value})
  }

  async handleClick () {
    const keys = await generateRandomKeys()
    const name = encodeURIComponent(this.state.name)
    const url = '/w/' + name + '/' + keys.read + '/' + keys.write
    this.setState({redirect: url})
  }
}

export default CreateDocument
