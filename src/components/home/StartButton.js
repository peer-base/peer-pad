import React from 'react'
import CreateDocumentContainer from './CreateDocumentContainer'

const StartButton = ({onClick}) => (
  <button
    onClick={onClick}
    type='button'
    className='dib bg-transparent ba b--bright-turquoise bright-turquoise fw2 tracked--1 pointer dim'
    style={{fontSize: '15px', padding: '5px 28px'}}>
    START
  </button>
)

export default () => (
  <CreateDocumentContainer children={({onCreateDocument}) => (
    <StartButton onClick={onCreateDocument} />
  )} />
)
