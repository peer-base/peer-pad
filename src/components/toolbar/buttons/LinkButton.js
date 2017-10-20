import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Button from './Button'
import { LinkIcon } from '../../icons'
import { Dropdown, DropdownMenu } from '../../Dropdown'

export default class LinkButton extends Component {
  constructor (props) {
    super(props)
    this.state = { dropdownOpen: false }
    this.onDropdownClick = this.onDropdownClick.bind(this)
    this.onDropdownDismiss = this.onDropdownDismiss.bind(this)
  }

  onDropdownClick () {
    this.setState({ dropdownOpen: true })
  }

  onDropdownDismiss () {
    this.setState({ dropdownOpen: false })
  }

  render () {
    const { onDropdownClick, onDropdownDismiss } = this
    const { theme, docType, docName, docKeys } = this.props
    const { dropdownOpen } = this.state

    const readUrl = getReadUrl({ docType, docName, docKeys })
    const writeUrl = getWriteUrl({ docType, docName, docKeys })

    return (
      <Dropdown>
        <Button theme={theme} icon={LinkIcon} title='Share link' onClick={onDropdownClick} />
        <DropdownMenu width={300} open={dropdownOpen} onDismiss={onDropdownDismiss}>
          <div className='pa3'>
            <label htmlFor='LinkButton-read-url' className='f7 dib mb1'>Read-only link:</label>
            <div className='flex flex-row mb2'>
              <div className='flex-auto mr2'>
                <input id='LinkButton-read-url' type='text' className='input-reset ba pa1 f7 w-100 mr1 pigeon-post br1' value={readUrl} readOnly />
              </div>
              <div>
                <button type='button' className='button-reset f7 white-lilac bg-bright-turquoise hover--white ph2 pv1 bw0 ttu pointer br1'>Copy</button>
              </div>
            </div>
            <label htmlFor='LinkButton-write-url' className='f7 dib mb1'>Writable link:</label>
            <div className='flex flex-row'>
              <div className='flex-auto mr2'>
                <input id='LinkButton-write-url' type='text' className='input-reset ba pa1 f7 w-100 pigeon-post br1' value={writeUrl} readOnly />
              </div>
              <div>
                <button type='button' className='button-reset f7 white-lilac bg-bright-turquoise hover--white ba b--bright-turquoise ph2 pv1 bw0 ttu pointer br1'>Copy</button>
              </div>
            </div>
          </div>
        </DropdownMenu>
      </Dropdown>
    )
  }
}

LinkButton.propTypes = {
  theme: PropTypes.oneOf(['light', 'dark']),
  docType: PropTypes.oneOf(['markdown', 'richtext']).isRequired,
  docName: PropTypes.string.isRequired,
  docKeys: PropTypes.shape({
    read: PropTypes.string.isRequired,
    write: PropTypes.string
  }).isRequired
}

export function getReadUrl ({ docType, docName, docKeys }) {
  const origin = window.location.origin
  return `${origin}/#/r/${docType}/${encodeURIComponent(docName)}/${docKeys.read}`
}

export function getWriteUrl ({ docType, docName, docKeys }) {
  const origin = window.location.origin
  return `${origin}/#/w/${docType}/${encodeURIComponent(docName)}/${docKeys.read}/${docKeys.write}`
}
