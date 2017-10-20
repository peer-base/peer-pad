import React from 'react'
import { CloseIcon, AlphaIcon } from '../icons'

export default ({onClose}) => (
  <div className='bg-razzmatazz white' style={{padding: '10px 15px'}}>
    <AlphaIcon className='dib fill--current-color v-mid mr3' />
    <span className='dib-ns v-mid f6 fw6 '>Peerpad is in Alpha. </span>
    <span className='db dib-ns pt3 pt0-l v-mid f6 fw3'>
      The codebase hasn't been audited by Security specialists and it shouldn't be used to store, share or publish sensitive information.
    </span>
    <button
      className='db dib-ns w-100 w-auto-ns tc ml3-ns pv3 p0-ns input-reset bg-transparent b--none  white v-mid'
      onClick={onClose} >
      <span className='dn-l v-mid f7 fw3'>Close </span>
      <CloseIcon className='fill--current-color v-mid' />
    </button>
  </div>
)
