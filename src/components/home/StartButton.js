import React from 'react'
import CreateDocumentContainer from './CreateDocumentContainer'

const StartButton = ({onClick}) => (
  <button
    onClick={onClick}
    type='button'
    className='dib bg-transparent ba b--bright-turquoise bright-turquoise ph4 pv1 fw1 tracked--1 pointer dim'
    style={{fontSize: '15px'}}>
    START
  </button>
)

export default () => (
  <CreateDocumentContainer children={({onCreateDocument}) => (
    <StartButton onClick={onCreateDocument} />
  )} />
)
