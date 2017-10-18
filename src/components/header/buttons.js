import React from 'react'
import PropTypes from 'prop-types'
import PlusIcon from '../icons/plus'
import UserIcon from '../icons/user'
import BellIcon from '../icons/bell'

export const NewButton = ({ onClick }) => (
  <button type='button' className='button-reset ba b--black-stone bg-bright-turquoise pa2 br-100 white-lilac hover--white pointer' onClick={onClick}>
    <PlusIcon className='db stroke--current-color' />
  </button>
)

NewButton.propTypes = {
  onClick: PropTypes.func.isRequired
}

export const UserButton = ({ onClick, count }) => (
  <button type='button' className='button-reset relative ba b--black-stone bg-firefly pa2 br-100 white-lilac hover-target pointer' onClick={onClick}>
    <UserIcon className='db stroke--current-color hover--bright-turquoise' />
    {count ? (
      <span className='absolute top-0 right-0 br-100 bg-bright-turquoise' style={{width: '12px', lineHeight: '12px', fontSize: '9px', right: '-3px'}}>{count}</span>
    ) : null}
  </button>
)

UserButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  count: PropTypes.number
}

export const NotificationsButton = ({ onClick, count }) => (
  <button type='button' className='button-reset relative ba b--black-stone bg-firefly pa2 br-100 white-lilac hover-target hover--bg-cloud-burst pointer' onClick={onClick}>
    <BellIcon className='db stroke--current-color hover--bright-turquoise' />
    {count ? (
      <span className='absolute top-0 right-0 br-100 bg-bright-turquoise' style={{width: '12px', lineHeight: '12px', fontSize: '9px', right: '-3px'}}>{count}</span>
    ) : null}
  </button>
)

NotificationsButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  count: PropTypes.number
}
