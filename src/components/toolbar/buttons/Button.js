import React from 'react'

function btnClass (disabled, theme) {
  const stem = 'button-reset db bg-transparent bw0 pigeon-post'
  if (disabled) return stem
  if (theme === 'light') {
    return stem + ' pointer hover--blue-bayox'
  }
  return stem + ' pointer hover--white-lilac'
}

const Button = ({ theme, icon: Icon, title, onClick, disabled = false }) => (
  <button
    type='button'
    className={btnClass(disabled, theme)}
    title={title}
    onClick={onClick}
    disabled={disabled}>
    <Icon className='db fill--current-color' style={{ width: '25px', height: '25px' }} />
  </button>
)

export default Button
