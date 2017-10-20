import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Dropdown, DropdownMenu } from '../../Dropdown'
import { UserIcon } from '../../icons'

export default class PeersButton extends Component {
  constructor (props) {
    super(props)

    this.state = { peers: {}, dropdownOpen: false }

    if (props.peerGroup) {
      this.state.peers = props.peerGroup.all()
      props.peerGroup.on('change', this.onPeersChange)
    }

    this.onPeersChange = this.onPeersChange.bind(this)
    this.onDropdownClick = this.onDropdownClick.bind(this)
    this.onDropdownDismiss = this.onDropdownDismiss.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    // Remove listener if receiving new peers object
    if (nextProps.peerGroup && this.props.peerGroup) {
      this.props.peerGroup.removeListener('change', this.onPeersChange)
    }

    // Add listener if receiving new peers object
    if (nextProps.peerGroup && nextProps.peerGroup !== this.props.peerGroup) {
      nextProps.peerGroup.on('change', this.onPeersChange)
      this.setState({ peers: nextProps.peerGroup.all() })
    }
  }

  componentWillUnmount () {
    if (this.props.peerGroup) {
      this.props.peerGroup.removeListener('change', this.onPeersChange)
    }
  }

  onPeersChange () {
    this.setState({ peers: this.props.peerGroup.all() })
  }

  onDropdownClick () {
    this.setState({ dropdownOpen: true })
  }

  onDropdownDismiss () {
    this.setState({ dropdownOpen: false })
  }

  render () {
    const { onDropdownClick, onDropdownDismiss } = this
    const { peers, dropdownOpen } = this.state
    const peerIds = Object.keys(peers)
    const count = peerIds.length

    return (
      <Dropdown>
        <button type='button' className='button-reset relative ba b--black-stone bg-firefly pa2 br-100 white-lilac hover-target pointer' onClick={onDropdownClick}>
          <UserIcon className='db stroke--current-color hover--bright-turquoise' />
          {count ? (
            <span className='absolute top-0 right-0 br-100 bg-bright-turquoise' style={{width: '12px', lineHeight: '12px', fontSize: '9px', right: '-3px'}}>{count}</span>
          ) : null}
        </button>
        <DropdownMenu width={200} open={dropdownOpen} onDismiss={onDropdownDismiss}>
          <div className='pa3'>
            {peerIds.length ? (
              <ul className='ma0 pa0'>
                {peerIds.sort().map((id, i) => (
                  <PeerItem
                    key={id}
                    id={id}
                    capabilities={peers[id].permissions}
                    last={i === peerIds.length - 1} />
                ))}
              </ul>
            ) : (
              <p className='f6 ma0'>No other peers</p>
            )}
          </div>
        </DropdownMenu>
      </Dropdown>
    )
  }
}

PeersButton.propTypes = {
  peerGroup: PropTypes.object
}

const PeerItem = ({ id, capabilities, last }) => {
  const permissions = Object.keys(capabilities)
    .filter((capability) => capabilities[capability])
    .join(', ')
  return (
    <li className={`flex flex-row ${last ? '' : 'mb2'} pointer`}>
      <span className='mr1'>
        <UserIcon
          className='db stroke--current-color pigeon-post' />
      </span>
      <span
        className='flex-auto f6'
        style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
        title={`${id} (${permissions})`}>
        {id}
      </span>
    </li>
  )
}
