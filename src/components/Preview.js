import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Doc from './Doc'
import styles from './Preview.module.styl'
import 'katex/dist/katex.css'

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
  async convert (md) {
    if (!this.props.convertMarkdown) {
      return
    }
    const html = await this.props.convertMarkdown(md, this.props.type)
    this.setState({ html })
  }

  render () {
    return <Doc className={`Doc ${styles.Preview}`} html={this.state.html} />
  }
}

Preview.propTypes = {
  md: PropTypes.string,
  convertMarkdown: PropTypes.func
}
