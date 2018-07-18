import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Button from './Button'
import { LinkIcon } from '../../icons'
import { Dropleft, DropleftMenu } from '../../dropdown/Dropleft'

export default class LinkButton extends Component {
  constructor (props) {
    super(props)

    this.state = { dropleftMenuOpen: false }

    this.onDropleftTriggerClick = this.onDropleftTriggerClick.bind(this)
    this.onDropleftMenuDismiss = this.onDropleftMenuDismiss.bind(this)
    this.onReadUrlRef = this.onReadUrlRef.bind(this)
    this.onWriteUrlRef = this.onWriteUrlRef.bind(this)
    this.onCopyReadUrlClick = this.onCopyReadUrlClick.bind(this)
    this.onCopyWriteUrlClick = this.onCopyWriteUrlClick.bind(this)
  }

  onDropleftTriggerClick () {
    this.setState({ dropleftMenuOpen: true })
  }

  onDropleftMenuDismiss () {
    this.setState({ dropleftMenuOpen: false })
  }

  onReadUrlRef (input) {
    this._readUrlInput = input
  }

  onWriteUrlRef (input) {
    this._writeUrlInput = input
  }

  onCopyReadUrlClick () {
    this.copy(this._readUrlInput)
  }

  onCopyWriteUrlClick () {
    this.copy(this._writeUrlInput)
  }

  copy (input) {
    input.select()

    try {
      document.execCommand('copy')
      input.blur()
    } catch (err) {
      console.error('Failed to exec copy command', err)
      window.alert('Please press Ctrl/Cmd+C to copy')
    }
  }

  getReadUrl () {
    const { docType: type, docName: name, encodedKeys: keys } = this.props
    const readKey = keys.split('-')[0]
    const root = window.location.origin + window.location.pathname
    return `${root}#/r/${type}/${encodeURIComponent(name)}/${readKey}`
  }

  getWriteUrl () {
    const { docType: type, docName: name, encodedKeys: keys } = this.props
    const root = window.location.origin + window.location.pathname
    return `${root}#/w/${type}/${encodeURIComponent(name)}/${keys}`
  }

  render () {
    const {
      onDropleftTriggerClick,
      onDropleftMenuDismiss,
      onCopyReadUrlClick,
      onCopyWriteUrlClick,
      onReadUrlRef,
      onWriteUrlRef
    } = this

    const { theme } = this.props
    const { dropleftMenuOpen } = this.state

    const readUrl = this.getReadUrl()
    const writeUrl = this.getWriteUrl()

    return (
      <Dropleft>
        <Button theme={theme} icon={LinkIcon} title='Share link' onClick={onDropleftTriggerClick} />
        <DropleftMenu width={300} height={132} open={dropleftMenuOpen} onDismiss={onDropleftMenuDismiss}>
          <div className='pa3'>
            <label htmlFor='LinkButton-read-url' className='f7 dib mb1'>Read-only link:</label>
            <div className='flex flex-row mb2'>
              <div className='flex-auto mr2'>
                <input id='LinkButton-read-url' type='text' className='input-reset ba b--pigeon-post pa1 f7 w-100 mr1 blue-bayox br1' value={readUrl} readOnly ref={onReadUrlRef} />
              </div>
              <div>
                <button type='button' className='button-reset f7 white-lilac bg-bright-turquoise hover--white ph2 pv1 bw0 ttu pointer br1' onClick={onCopyReadUrlClick}>Copy</button>
              </div>
            </div>
            <label htmlFor='LinkButton-write-url' className='f7 dib mb1'>Writable link:</label>
            <div className='flex flex-row'>
              <div className='flex-auto mr2'>
                <input id='LinkButton-write-url' type='text' className='input-reset ba b--pigeon-post pa1 f7 w-100 blue-bayox br1' value={writeUrl} readOnly ref={onWriteUrlRef} />
              </div>
              <div>
                <button type='button' className='button-reset f7 white-lilac bg-bright-turquoise hover--white ba b--bright-turquoise ph2 pv1 bw0 ttu pointer br1' onClick={onCopyWriteUrlClick}>Copy</button>
              </div>
            </div>
          </div>
        </DropleftMenu>
      </Dropleft>
    )
  }
}

LinkButton.propTypes = {
  theme: PropTypes.oneOf(['light', 'dark']),
  docType: PropTypes.oneOf(['markdown', 'richtext', 'math']).isRequired,
  docName: PropTypes.string.isRequired,
  encodedKeys: PropTypes.string.isRequired
}
