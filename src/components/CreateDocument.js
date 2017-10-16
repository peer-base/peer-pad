import { generateRandomKeys } from 'peerpad-core'

import React, { Component } from 'react'
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
      const redir = this.state.redirect
      this.setState({ redirect: null })
      return (<Redirect to={redir} push />)
    }

    return (
      <form>
        <div>
          <input
            value={this.state.name}
            placeholder='pad name'
            onChange={this.handleNameChange.bind(this)} />

          <select
            placeholder='select type'
            onChange={this.handleTypeChange.bind(this)}>
            <option value=''>select type</option>
            <option value='markdown'>Markdown</option>
            <option value='richtext'>Rich text</option>
          </select>

          <button
            type='button'
            onClick={this.handleClick.bind(this)}>
            Create new Document
          </button>
        </div>
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
    const type = encodeURIComponent(this.state.type || 'markdown')
    const name = encodeURIComponent(encodeURIComponent(this.state.name))
    const keys = await generateRandomKeys()
    const url = '/w/' + type + '/' + name + '/' + keys.read + '/' + keys.write
    this.setState({redirect: url})
  }
}

export default CreateDocument
