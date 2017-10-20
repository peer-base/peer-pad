import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Button from './Button'
import { LinkIcon } from '../../icons'
import { Dropdown, DropdownMenu } from '../../Dropdown'

class LinkButton extends Component {
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

    const readUrl = getReadUrl({ docType, docName, docKeys })
    const writeUrl = getWriteUrl({ docType, docName, docKeys })

    return (
      <Dropdown>
        <Button theme={theme} icon={LinkIcon} title='Share link' onClick={onDropdownClick} />
        <DropdownMenu width={300} onDismiss={onDropdownDismiss}>
          <div className='pa3'>
            <input type='text' className='input-reset' value={readUrl} />
            <input type='text' className='input-reset' value={writeUrl} />
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
  return `/r/${docType}/${encodeURIComponent(docName)}/${docKeys.read}`
}

export function getWriteUrl ({ docType, docName, docKeys }) {
  return `/w/${docType}/${encodeURIComponent(docName)}/${docKeys.read}/${docKeys.write}`
}
