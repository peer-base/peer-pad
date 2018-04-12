import React from 'react'

const Hexicon = ({name}) => (
  <div
    className='hexicon dt caribbean-green center relative'
    style={{width: 108, height: 124, background: 'transparent url(images/hex.svg) center no-repeat'}} >
    <div className='dtc v-mid tc w-100'>
      <img
        alt={name}
        className='center v-mid'
        style={{maxWidth: 60}}
        src={`images/${name.toLowerCase().replace(/ /g, '-')}.svg`} />
    </div>
  </div>
)

export default Hexicon
