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

          <FormControl
            componentClass="select"
            placeholder="select type"
            onChange={this.handleTypeChange.bind(this)}>
              <option value="select">select type</option>
              <option value="markdown">Markdown</option>
              <option value="richtext">Rich text</option>
          </FormControl>

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

  handleTypeChange (event) {
    this.setState({type: event.target.value})
  }

  async handleClick () {
    const type = encodeURIComponent(this.state.type)
    const name = encodeURIComponent(encodeURIComponent(this.state.name))
    const keys = await generateRandomKeys()
    const url = '/w/' + type + '/' + name + '/' + keys.read + '/' + keys.write
    this.setState({redirect: url})
  }
}

export default CreateDocument
