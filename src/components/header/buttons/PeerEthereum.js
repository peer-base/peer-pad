import React, { Component } from 'react'
import { Dropleft, DropleftMenu } from '../../dropdown/Dropleft'
import { EthereumIcon } from '../../icons'
import Button from './Button'

export default class PeerEthereum extends Component {
  constructor (props) {
    super(props)

    this.state = { dropleftMenuOpen: false }

    this.onDropleftTriggerClick = this.onDropleftTriggerClick.bind(this)
    this.onDropleftMenuDismiss = this.onDropleftMenuDismiss.bind(this)
  }

  onDropleftTriggerClick () {
    this.setState({ dropleftMenuOpen: true })
  }

  onDropleftMenuDismiss () {
    this.setState({ dropleftMenuOpen: false })
  }


  render () {
    const {
      onDropleftTriggerClick,
      onDropleftMenuDismiss
    } = this

    const { dropleftMenuOpen } = this.state

    return (
      <Dropleft>
        <Button icon={EthereumIcon} onClick={onDropleftTriggerClick} />
        <DropleftMenu width={300} height={132} open={dropleftMenuOpen} onDismiss={onDropleftMenuDismiss}>
          <div className='pa3'>
            <pre>
              {JSON.stringify(this.props.ethereum, null, '\t')}
            </pre>
          </div>
        </DropleftMenu>
      </Dropleft>
    )
  }
}
