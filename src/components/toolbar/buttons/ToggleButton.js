import React from 'react'

function btnClass (disabled, theme) {
  const stem = 'button-reset db bg-transparent bw0 pigeon-post pointer'
  if (disabled) return stem
  if (theme === 'light') {
    return stem + ' blue-bayox'
  }
  return stem + ' white-lilac'
}

const ToggleButton = ({ theme, icon: Icon, title, onClick, disabled }) => (
  <button
    type='button'
    className={btnClass(disabled, theme)}
    title={title}
    onClick={onClick} >
    <Icon className='db fill--current-color' style={{ width: '25px', height: '25px' }} />
  </button>
)

export default ToggleButton
