import React from 'react'

// Styling for the dropdown box and shadow, and reset positon to relative.
const Menu = ({children}) => (
  <div style={{
    position: 'relative',
    textAlign: 'left',
    zIndex: 500,
    background: 'white',
    boxShadow: '0 1px 5px 0 rgba(0,0,0,0.20)',
    minHeight: '100%'
  }} className='br1'>
    {children}
  </div>
)

export default Menu
