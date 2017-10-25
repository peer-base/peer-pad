import React from 'react'
import PropTypes from 'prop-types'
import { PlusIcon } from '../../icons'

const NewButton = ({ onClick }) => {
  if (!onClick) return null
  return (
    <button type='button' className='button-reset ba b--black-stone bg-bright-turquoise pa2 br-100 white-lilac hover--white pointer' onClick={onClick}>
      <PlusIcon className='db stroke--current-color' />
    </button>
  )
}

NewButton.propTypes = {
  onClick: PropTypes.func.isRequired
}

export default NewButton
