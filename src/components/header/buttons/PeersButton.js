import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Dropdown, DropdownMenu } from '../../dropdown/Dropdown'
import { UserIcon } from '../../icons'
import peerColor from '../../../lib/peer-color'
import mergeAliases from '../../../lib/merge-aliases'

export default class PeersButton extends Component {
  constructor (props) {
    super(props)

    const initialState = {
      peers: (props.doc && props.doc.peers()) || {},
      dropdownOpen: false,
      alias: props.alias || ''
    }

    this.state = initialState

    this.onPeersChange = this.onPeersChange.bind(this)
    this.onDropdownClick = this.onDropdownClick.bind(this)
    this.onDropdownDismiss = this.onDropdownDismiss.bind(this)
    this.onAliasChange = this.onAliasChange.bind(this)
    this.onSaveAlias = this.onSaveAlias.bind(this)

    if (props.doc) {
      props.doc.on('membership changed', this.onPeersChange)
      this.bindAliases()
    }
  }

  componentWillReceiveProps (nextProps) {
    // Remove listener if receiving new peers object
    if (nextProps.doc && this.props.doc) {
      this.props.doc.removeListener('membership changed', this.onPeersChange)
      nextProps.doc.on('membership changed', this.onPeersChange)
      this.setState({ peers: nextProps.doc.peers() })
      this.bindAliases()
    }
  }

  componentWillUnmount () {
    if (this.props.peerGroup) {
      this.props.peerGroup.removeListener('change', this.onPeersChange)
    }
  }

  onPeersChange () {
    this.setState({ peers: this.props.doc.peers() })
  }

  onDropdownClick () {
    this.setState({ dropdownOpen: true })
  }

  onDropdownDismiss () {
    this.setState({ dropdownOpen: false })
  }

  bindAliases () {
    this.props.doc.sub('aliases', 'mvreg')
      .then((aliasesCollab) => {
        const aliases = mergeAliases(aliasesCollab.shared.value())
        this.setState({ aliases })
        aliasesCollab.on('state changed', () => {
          const aliases = mergeAliases(aliasesCollab.shared.value())
          this.setState({ aliases })
        })
      })
      .catch((err) => {
        console.error('error in aliases collaboration:', err)
      })
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
    const peerIds = Array.from(peers).sort()
    const count = peerIds.length - 1
    return (
      <Dropdown>
        <button
          type='button'
          className='button-reset relative ba b--black-stone bg-firefly pa2 br-100 white-lilac hover-target pointer'
          onClick={onDropdownClick}
          data-id='peers-button'
          data-peer-count={count}
          >
          <UserIcon className='db stroke--current-color hover--bright-turquoise' />
          {count > 0 ? (
            <span className='absolute top-0 right-0 br-100 bg-bright-turquoise' style={{width: '12px', lineHeight: '12px', fontSize: '9px', right: '-3px'}}>{count}</span>
          ) : null}
        </button>
        <DropdownMenu width={200} open={dropdownOpen} onDismiss={onDropdownDismiss}>
          <div className='pa3'>
            {count >= 0 ? (
              <ul className='ma0 pa0'>
                {peerIds.map((id, i) => (
                  <PeerItem
                    key={id}
                    id={id}
                    alias={this.state.aliases[id]}
                    last={i === count - 1} />
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
  doc: PropTypes.object,
  alias: PropTypes.string,
  onAliasChange: PropTypes.func
}

const PeerItem = ({ id, alias, last }) => {
  let aliasElem = (alias ? <span>{alias}</span> : '')
  if (!aliasElem) {
    aliasElem = id
  }
  return (
    <li className={`flex flex-row ${last ? '' : 'mb2'} pointer`}>
      <span className='mr1'>
        <UserIcon
          className='db stroke--current-color pigeon-post' />
      </span>
      <span
        className='flex-auto f6'
        style={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          borderBottom: `3px solid ${peerColor(id)}`
        }}
        title={alias || id}>
        {aliasElem}
      </span>
    </li>
  )
}
