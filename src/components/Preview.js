import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Remark from 'remark'
import RemarkHtml from 'remark-html'
import Doc from './Doc'
import './Preview.css'

const markdown = Remark().use(RemarkHtml)

export default class Preview extends Component {
  constructor (props) {
    super(props)
    this.state = { html: '' }
  }

  componentWillMount () {
    const { md } = this.props
    if (!md) return
    this.convert(md)
  }

  componentWillReceiveProps (nextProps) {
    this.convert(nextProps.md)
  }

  // TODO: debounce?
  convert (md) {
    markdown.process(md, (err, html) => {
      if (err) return console.error('Failed to convert markdown to HTML', err)
      this.setState({ html })
    })
  }

  render () {
    return <Doc className='Doc Preview' html={this.state.html} />
  }
}

Preview.propTypes = {
  md: PropTypes.string.isRequired
}
