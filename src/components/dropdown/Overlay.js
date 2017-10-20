import React from 'react'

// Invisible click grabber, to detect when the user clicks away.
const Overlay = ({onClick}) => {
  return (
    <div onClick={onClick} style={{
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0}} />
  )
}

export default Overlay
