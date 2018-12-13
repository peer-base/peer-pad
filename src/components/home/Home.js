import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

class Home extends Component {
  constructor (props) {
    super(props)
    this.state = {
      redirect: null
    }
  }
  async componentDidMount () {
    try {
      const generateRandomKeys = await import('peer-base/src/keys/generate')
      const generateRandomName = await import('peer-base/src/keys/generate-random-name')
      const uriEncodeKey = await import('peer-base/src/keys/uri-encode')
      const type = encodeURIComponent('markdown')
      const name = encodeURIComponent(generateRandomName())
      const keys = await generateRandomKeys()
      const url = '/w/' + type + '/' + name + '/' + uriEncodeKey(keys)
      this.setState({redirect: url})
    } catch (err) {
      window.alert(
        'An error occurred while trying to create pad for you.\n' +
          'This may be because you may be using a non-compatible browser.\n' +
          'If this is the case, please try, if you can, with latest Firefox or Chrome.')
      throw err
    }
  }
  render () {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} push />
    }
    return null
  }
}

export default Home
