import { generateRandomKeys } from 'peerpad-core'

import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

class CreateDocument extends Component {
  constructor (props) {
    super(props)
    this.state = {
      name: 'New PeerPad'
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
        <div className='lh-copy'>
          <label className='db dib-ns fw1 tracked--1 white mv2' style={{fontSize: '28px'}}>
            Create new:
          </label>
          <select
            className='appearance-none fw1 tracked--1 mh3 mv2 ph3 pv2 ba b--dashed b--caribbean-green-soft white tc'
            style={{fontSize: '18px', borderRadius: 0, background: 'none'}}
            placeholder='select type'
            onChange={this.handleTypeChange.bind(this)}>
            <option className='black' style={{fontSize: '18px'}} value='markdown'>Markdown pad</option>
            <option className='black' style={{fontSize: '18px'}} value='richtext'>Rich text pad</option>
          </select>
          <button
            type='button'
            className='input-reset bg-caribbean-green ba b--caribbean-green white f6 fw5 mv2 ph3 pv2 dim tracked--1'
            onClick={this.handleClick.bind(this)}>GO</button>
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
