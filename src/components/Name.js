import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Name extends Component {
  constructor (props) {
    super(props)

    this.state = { editing: false }

    this.onClick = this.onClick.bind(this)
    this.onFocus = this.onFocus.bind(this)
    this.onBlur = this.onBlur.bind(this)
    this.onChange = this.onChange.bind(this)
  }

  onClick () {
    if (!this.props.editable) return
    this.setState({ editing: true })
  }

  onFocus (e) {
    // Position the caret at the end of the text
    const len = e.target.value.length
    e.target.setSelectionRange(len, len)
  }

  onBlur () {
    this.setState({ editing: false })
  }

  onChange (e) {
    this.props.onChange(e.target.value)
  }

  render () {
    const { value, editable } = this.props
    const { editing } = this.state
    const { onClick, onFocus, onBlur, onChange } = this

    if (editable && editing) {
      return (
        <input type='text' className='input-reset sans-serif bw0 f4 blue-bayox w-100 pa0' value={value} placeholder='Document Title' autoFocus onFocus={onFocus} onBlur={onBlur} onChange={onChange} />
      )
    }

    return (
      <h1 className='normal ma0 f4 blue-bayox pointer' onClick={onClick}>
        {value || 'Document Title'}
      </h1>
    )
  }
}

Name.propTypes = {
  value: PropTypes.string.isRequired,
  editable: PropTypes.bool,
  onChange: PropTypes.func.isRequired
}

Name.defaultProps = {
  editable: true
}

export default Name
