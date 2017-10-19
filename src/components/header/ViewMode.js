import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { CodeIcon, TextIcon } from '../icons'

export default class ViewMode extends Component {
  constructor (props) {
    super(props)
    this.onClick = this.onClick.bind(this)
  }

  onClick (e) {
    const mode = e.currentTarget.getAttribute('data-mode')
    const active = this.isActive(mode)

    if (active && this.props.mode !== 'both') {
      return
    }

    let nextMode

    if (active) {
      nextMode = mode === 'source' ? 'preview' : 'source'
    } else {
      nextMode = 'both'
    }

    this.props.onChange(nextMode)
  }

  isActive (mode) {
    return this.props.mode === mode || this.props.mode === 'both'
  }

  render () {
    const { onClick } = this

    return (
      <div>
        <Button mode='source' active={this.isActive('source')} onClick={onClick}>
          <CodeIcon className='db stroke--current-color' />
        </Button>
        <Button mode='preview' active={this.isActive('preview')} onClick={onClick}>
          <TextIcon className='db stroke--current-color' />
        </Button>
      </div>
    )
  }
}

ViewMode.propTypes = {
  mode: PropTypes.oneOf(['source', 'preview', 'both']).isRequired,
  onChange: PropTypes.func.isRequired
}

const Button = ({ mode, active, onClick, children }) => {
  const className = active
    ? 'bt bw1 b--bright-turquoise bright-turquoise'
    : 'bt bw1 b--firefly white hover--bright-turquoise'

  return (
    <button type='button' className='button-reset ba b--black-stone bg-firefly pa0 pointer br1 br--right' data-mode={mode} onClick={onClick}>
      <div className={className} style={{padding: '0 2px 2px'}}>
        {children}
      </div>
    </button>
  )
}
