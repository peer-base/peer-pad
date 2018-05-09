import React from 'react'
import CreateDocumentContainer from './CreateDocumentContainer'

const StartButton = ({onClick}) => (
  <button
    onClick={onClick}
    type='button'
    className='dib bg-transparent ba b--bright-turquoise bright-turquoise fw2 tracked--1 pointer dim ml3'
    style={{fontSize: '15px', padding: '5px 28px'}}
    data-id='start-button'>
    START
  </button>
)

export default () => (
  <CreateDocumentContainer children={({onCreateDocument}) => (
    <StartButton onClick={onCreateDocument} />
  )} />
)
