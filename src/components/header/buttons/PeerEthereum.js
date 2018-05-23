import React, { Component } from 'react'
import { Dropleft, DropleftMenu } from '../../dropdown/Dropleft'
import { EthereumIcon, CheckFailIcon, CheckGreyIcon, CheckYellowIcon, CheckGreenIcon } from '../../icons'
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
    const ethereum = this.props.ethereum
    const proofs = ethereum && ethereum.proofs

    return (
      <Dropleft>
        { ethereum.verified ? <Button icon={EthereumIcon} onClick={onDropleftTriggerClick} /> : <CheckFailIcon /> }
        <DropleftMenu width={300} height={132} open={dropleftMenuOpen} onDismiss={onDropleftMenuDismiss}>
          <div className='pa3'>
            {
              !this.props.ethereum.verified ? (<div><CheckFailIcon /><span>&nbsp; Failed verification</span></div>) : (
              <div>
                {
                  !Object.keys(proofs).length ? (
                    <div>
                      <CheckYellowIcon /><span>&nbsp;Metamask</span>
                    </div>) :
                    Object.keys(proofs).map((proofRealm) => (
                      <div>
                        <CheckGreenIcon /><span>&nbsp;<a href={proofs[proofRealm]}>{proofRealm}</a></span>
                      </div>
                    ))
                }
              </div>
              )
            }
          </div>
        </DropleftMenu>
      </Dropleft>
    )
  }
}
