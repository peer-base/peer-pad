import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Dropdown, DropdownMenu } from '../../dropdown/Dropdown'
import { UserIcon } from '../../icons'

export default class PeersButton extends Component {
  constructor (props) {
    super(props)

    const initialState = {
      peers: {},
      dropdownOpen: false,
      alias: props.alias || ''
    }

    this.state = initialState

    this.onPeersChange = this.onPeersChange.bind(this)
    this.onDropdownClick = this.onDropdownClick.bind(this)
    this.onDropdownDismiss = this.onDropdownDismiss.bind(this)
    this.onAliasChange = this.onAliasChange.bind(this)
    this.onSaveAlias = this.onSaveAlias.bind(this)

    if (props.peerGroup) {
      initialState.peers = props.peerGroup.all()
      props.peerGroup.on('change', this.onPeersChange)
    }
  }

  componentWillReceiveProps (nextProps) {
    // Remove listener if receiving new peers object
    if (nextProps.peerGroup && this.props.peerGroup) {
      this.props.peerGroup.removeListener('change', this.onPeersChange)
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
    if (this.props.peerGroup) {
      this.setState({ peers: this.props.peerGroup.all() })
    } else {
      setTimeout(this.onPeersChange.bind(this), 1000)
    }
  }

  onDropdownClick () {
    this.setState({ dropdownOpen: true })
  }

  onDropdownDismiss () {
    this.setState({ dropdownOpen: false })
  }

  onAliasChange (ev) {
    const alias = ev.target.value
    this.setState({ alias })
  }

  onSaveAlias () {
    const { alias } = this.state
    this.props.onAliasChange(alias)
  }

  render () {
    const { onDropdownClick, onDropdownDismiss } = this
    const { peers, dropdownOpen, alias } = this.state
    const count = Object.keys(peers).length - 1

    return (
      <Dropdown>
        <button type='button' className='button-reset relative ba b--black-stone bg-firefly pa2 br-100 white-lilac hover-target pointer' onClick={onDropdownClick}>
          <UserIcon className='db stroke--current-color hover--bright-turquoise' />
          {count > 0 ? (
            <span className='absolute top-0 right-0 br-100 bg-bright-turquoise' style={{width: '12px', lineHeight: '12px', fontSize: '9px', right: '-3px'}}>{count}</span>
          ) : null}
        </button>
        <DropdownMenu width={200} open={dropdownOpen} onDismiss={onDropdownDismiss}>
          <div className='pa3'>
            {count >= 0 ? (
              <ul className='ma0 pa0'>
                {Object.keys(peers).sort().map((id, i) => (
                  <PeerItem
                    key={id}
                    id={peers[id].alias || id}
                    capabilities={peers[id].permissions}
                    last={i === count - 1}
                    me={peers[id].me} />
                ))}
              </ul>
            ) : (
              <p className='f6 ma0'>No other peers</p>
            )}
            <div className='f6 ma0 pa0'>
              <input type='text' className='bn-m dib w-60 ph1 pv1 mr1' value={alias} placeholder='Your name' onChange={this.onAliasChange} />
              <button type='button' className='button-reset dib w-30 pa0 ma0 white-lilac bg-bright-turquoise hover--white ba b--bright-turquoise ph2 pv1 bw0 ttu pointer br1' onClick={this.onSaveAlias}>SET</button>
            </div>
          </div>
        </DropdownMenu>
      </Dropdown>
    )
  }
}

PeersButton.propTypes = {
  peerGroup: PropTypes.object,
  alias: PropTypes.string,
  onAliasChange: PropTypes.func
}

const PeerItem = ({ id, capabilities, last, me }) => {
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
      {
        me && (
          <span className='f7'>(me)</span>
        )
      }
    </li>
  )
}
