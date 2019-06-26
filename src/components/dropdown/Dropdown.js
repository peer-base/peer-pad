import React from 'react'
import PropTypes from 'prop-types'
import Overlay from './Overlay'
import Menu from './Menu'

/*
 * Dropdown & DropdownMenu
 *
 * Usage:
 *   <Dropdown>
 *     <button onClick={() => this.setState({open: true})}>Fire!</button>
 *     <DropdownMenu width={200} open={this.state.open}>
 *      <div>Option 1</div>
 *      <div>Option 2</div>
 *     </DropdownMenu>
 *   </Dropdown>
 */

export const Dropdown = ({children, className}) => (
  <div className={`dib ${className || ''}`}>
    {children}
  </div>
)

// `open` is used to show and hide the menu
// `top` is used to move the menu and arrow down.
const Container = ({open, top = 0, children}) => (
  <div style={{
    display: open ? null : 'none',
    position: 'relative',
    top
  }} data-id='dropdown-menu'>
    {children}
  </div>
)

// An arrow tip that appears at the top middle of the dropdown menu
const MenuArrowUp = ({height = 12, align = 'center', marginLeft = 'auto', marginRight = 'auto'}) => {
  const side = Math.round(Math.sqrt(2) * height)

  return (
    <div style={{
      zIndex: 600,
      position: 'absolute',
      height: `${height}px`,
      top: `-${height}px`,
      textAlign: align,
      overflow: 'hidden',
      width: '30px',
      right: 0
    }}>
      <div style={{
        display: 'inline-block',
        position: 'relative',
        width: `${side}px`,
        height: `${side}px`,
        transform: `translate(0, ${height / 2}px) rotate(45deg)`,
        borderRadius: '2px 0 0 0',
        background: 'white',
        left: marginLeft,
        right: marginRight,
        boxShadow: '0px 1px 10px 0px rgba(0,0,0,0.20)'
      }} />
    </div>
  )
}

// An arrow tip that appears at the bottom middle of the dropdown menu
const MenuArrowDown = ({height = 12, align = 'center', marginLeft = 'auto', marginRight = 'auto'}) => {
  const side = Math.round(Math.sqrt(2) * height)

  return (
    <div style={{
      zIndex: 600,
      width: '100%',
      height: `${height + 5}px`,
      textAlign: align,
      overflow: 'hidden'
    }}>
      <div style={{
        display: 'inline-block',
        position: 'relative',
        width: `${side}px`,
        height: `${side}px`,
        transform: `translate(0, ${height / 2}px) rotate(45deg)`,
        borderRadius: '2px 0 0 0',
        background: 'white',
        boxShadow: '0px 1px 10px 0px rgba(0,0,0,0.20)',
        top: `-${height + 2}px`,
        left: marginLeft,
        right: marginRight,
        zIndex: 601
      }} />
    </div>
  )
}

// `width` forces the width of the Menu.
//         width is required to make other calculaitons possible.
// `left` is the pixels from the left edge of the trigger element...
//        centered by default.
//        `left={0}` would make the left of the menu inline with the left of the
//         trigger element.
const MenuPosition = ({width, left = `calc(50% - ${width / 2}px)`, children}) => (
  <div style={{
    position: 'absolute',
    width: `${width}px`,
    right: 0
  }}>
    {children}
  </div>
)

export const DropdownMenu = ({open, width, left, top = 0, arrowHeight = 12, arrowPosition = 'top', arrowAlign, arrowMarginLeft, arrowMarginRight, onDismiss, children}) => {
  return (
    <Container open={open} top={top + arrowHeight}>
      <Overlay onClick={onDismiss} />
      <MenuPosition width={width} left={left}>
        {arrowPosition === 'top' && <MenuArrowUp height={arrowHeight} align={arrowAlign} marginLeft={arrowMarginLeft} marginRight={arrowMarginRight} />}
        <Menu>
          {children}
        </Menu>
        {arrowPosition === 'bottom' && <MenuArrowDown height={arrowHeight} align={arrowAlign} marginLeft={arrowMarginLeft} marginRight={arrowMarginRight} />}
      </MenuPosition>
    </Container>
  )
}

DropdownMenu.propTypes = {
  open: PropTypes.bool.isRequired,
  width: PropTypes.number.isRequired,
  left: PropTypes.number,
  top: PropTypes.number,
  arrowHeight: PropTypes.number,
  arrowAlign: PropTypes.oneOf(['left', 'center', 'right']),
  arrowMarginTop: PropTypes.number,
  arrowMarginBottom: PropTypes.number,
  onDismiss: PropTypes.func,
  children: PropTypes.node
}
