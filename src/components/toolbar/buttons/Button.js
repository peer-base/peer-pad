import React from 'react'

const Button = ({ theme, icon: Icon, title, onClick }) => (
  <button type='button' className={`button-reset db bg-transparent bw0 pigeon-post ${theme === 'light' ? 'hover--blue-bayox' : 'hover--white-lilac'} pointer`} title={title} onClick={onClick}>
    <Icon className='db fill--current-color' style={{ width: '25px', height: '25px' }} />
  </button>
)

export default Button
