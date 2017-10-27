import React from 'react'
import PropTypes from 'prop-types'
import { BellIcon } from '../../icons'

const NotificationsButton = ({ onClick, count }) => {
  if (!onClick) return null
  return (
    <button type='button' className='button-reset relative ba b--black-stone bg-firefly pa2 br-100 white-lilac hover-target hover--bg-cloud-burst pointer' onClick={onClick}>
      <BellIcon className='db stroke--current-color hover--bright-turquoise' />
      {count ? (
        <span className='absolute top-0 right-0 br-100 bg-bright-turquoise' style={{width: '12px', lineHeight: '12px', fontSize: '9px', right: '-3px'}}>{count}</span>
      ) : null}
    </button>
  )
}

NotificationsButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  count: PropTypes.number
}

export default NotificationsButton
