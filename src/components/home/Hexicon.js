import React from 'react'

const Hexicon = ({name}) => (
  <div
    className='dt caribbean-green center'
    style={{width: 108, height: 124, background: 'transparent url(images/hex.svg) center no-repeat'}} >
    <div className='dtc v-mid tc'>
      <img
        alt={name}
        className='center v-mid'
        style={{maxWidth: 60}}
        src={`images/${name.toLowerCase().replace(/ /g, '-')}.svg`} />
    </div>
  </div>
)

export default Hexicon
