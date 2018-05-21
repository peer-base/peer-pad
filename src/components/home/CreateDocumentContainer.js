import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

/*
 * "Children as fn" style container, to create and redirect to a new docuement.
 * Used by `CreateDocument` and `StartButton`
 */
export default class CreateDocumentContainer extends Component {
  constructor (props) {
    super(props)
    this.state = {
      type: 'markdown',
      name: ''
    }
    this.onNameChange = this.onNameChange.bind(this)
    this.onTypeChange = this.onTypeChange.bind(this)
    this.onCreateDocument = this.onCreateDocument.bind(this)
  }

  render () {
    if (this.state.redirect) {
      const redir = this.state.redirect
      this.setState({ redirect: null })
      return (<Redirect to={redir} push />)
    }

    return this.props.children({
      ...this.state,
      onNameChange: this.onNameChange,
      onTypeChange: this.onTypeChange,
      onCreateDocument: this.onCreateDocument
    })
  }

  onNameChange (name) {
    this.setState({name})
  }

  onTypeChange (type) {
    this.setState({type})
  }

  async onCreateDocument () {
    try {
      const generateRandomKeys = await import('peer-pad-core/src/backend/keys/generate')
      const generateRandomName = await import('peer-pad-core/src/backend/keys/generate-random-name')
      const type = encodeURIComponent(this.state.type || 'markdown')
      const name = encodeURIComponent(this.state.name || generateRandomName())
      const keys = await generateRandomKeys()
      const url = '/w/' + type + '/' + name + '/' + keys.read + '/' + keys.write
      this.setState({redirect: url})
    } catch (err) {
        alert(
          'An error occurred while trying to create pad for you.\n' +
          'This may be because you may be using a non-compatible browser.\n' +
          'If this is the case, please try, if you can, with latest Firefox or Chrome.')
        throw err
    }
  }
}
