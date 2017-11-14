import React, { Component } from 'react'
import { CloseIcon, AlphaIcon } from './icons'

export const Warning = ({onClose}) => (
  <div className='bg-razzmatazz white' style={{padding: '20px'}}>
    <AlphaIcon className='dib fill--current-color v-mid mr3' />
    <span className='dib-ns v-mid f6 fw6 '>Peerpad is in Alpha. </span>
    <span className='db dib-ns pt3 pt0-l v-mid f6 fw3'>
      The codebase hasn't been audited by Security specialists and it shouldn't be used to store, share or publish sensitive information.
    </span>
    {onClose ? (
      <button
        type='button'
        className='db dib-ns w-100 w-auto-ns tc ml3-ns pv2 p0-ns bg-transparent b--none  white v-mid pointer'
        onClick={onClose} >
        <span className='dn-l v-mid f7 fw3'>Close </span>
        <CloseIcon className='fill--current-color v-mid' />
      </button>
    ) : null }
  </div>
)

export class WarningContainer extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showWarning: false
    }
    this.onDismissWarning = this.onDismissWarning.bind(this)
  }

  componentDidMount () {
    if (!window.localStorage) return
    const showWarning = !window.localStorage.getItem('alpha-warning-dismissed')
    if (showWarning !== this.state.showWarning) {
      this.setState({
        showWarning: showWarning
      })
    }
  }

  onDismissWarning () {
    this.setState({showWarning: false})
    if (!window.localStorage) return
    window.localStorage.setItem('alpha-warning-dismissed', Date.now())
  }

  render () {
    if (!this.state.showWarning) return null
    return <Warning onClose={this.onDismissWarning} />
  }
}

// The Warning should not be dismissable yet...
// see: https://github.com/ipfs-shipyard/peerpad/issues/59
// Export WarningContainer when we're ready for dismissable warnings.
export default Warning
