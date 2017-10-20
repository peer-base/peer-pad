import React from 'react'
import PropTypes from 'prop-types'
import Overlay from './Overlay'
import Menu from './Menu'

/*
 * Dropleft & DropleftMenu
 *
 * Usage:
 *   <Dropleft>
 *     <button onClick={() => this.setState({open: true})}>Fire!</button>
 *     <DropleftMenu width={200} height={300} open={this.state.open}>
 *       <div>Option 1</div>
 *       <div>Option 2</div>
 *     </DropleftMenu>
 *   </Dropleft>
 */

export const Dropleft = ({children, className, style}) => {
  style = Object.assign({
    position: 'relative',
    display: 'inline-block'
  }, style)

  return (
    <div className={className} style={style}>
      {children}
    </div>
  )
}

// `open` is used to show and hide the menu
// `left` is used to move the menu and arrow to the left.
const Container = ({open, left = -12, children}) => (
  <div style={{
    display: open ? null : 'none',
    position: 'absolute',
    top: '50%',
    left
  }} data-id='dropleft-menu'>
    {children}
  </div>
)

const MenuArrowRight = ({height = 12, align = 'middle', marginTop = 'auto', marginBottom = 'auto'}) => {
  const side = Math.round(Math.sqrt(2) * height)
  let top = 'auto'
  let bottom = 'auto'

  if (align === 'top') {
    top = 0
  } else if (align === 'middle') {
    top = `calc(50% - ${height}px)`
  } else {
    bottom = 0
  }

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      right: `${-(height + 5)}px`,
      zIndex: 600,
      width: `${height + 5}px`,
      height: '100%',
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
        top,
        bottom,
        left: `-${height}px`,
        marginTop: marginTop,
        marginBottom: marginBottom,
        zIndex: 601
      }} />
    </div>
  )
}

// `height` forces the height of the Menu.
//         height is required to make other calculaitons possible.
// `top` is the pixels from the top edge of the trigger element...
//        centered by default.
//        `top={0}` would make the top of the menu inline with the top of the
//         trigger element.
const MenuPosition = ({width, height, top = `calc(50% - ${height / 2}px)`, children}) => (
  <div style={{
    position: 'absolute',
    width: `${width}px`,
    height: `${height}px`,
    top,
    left: `-${width}px`
  }}>
    {children}
  </div>
)

export const DropleftMenu = ({open, width, height, top, arrowHeight = 12, arrowAlign, arrowMarginTop, arrowMarginBottom, onDismiss, children}) => {
  return (
    <Container open={open} left={-arrowHeight}>
      <Overlay onClick={onDismiss} />
      <MenuPosition width={width} height={height} top={top}>
        <Menu>
          {children}
        </Menu>
        <MenuArrowRight height={arrowHeight} align={arrowAlign} marginTop={arrowMarginTop} marginBottom={arrowMarginBottom} />
      </MenuPosition>
    </Container>
  )
}

DropleftMenu.propTypes = {
  open: PropTypes.bool.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  top: PropTypes.number,
  arrowHeight: PropTypes.number,
  arrowAlign: PropTypes.oneOf(['top', 'middle', 'bottom']),
  arrowMarginTop: PropTypes.number,
  arrowMarginBottom: PropTypes.number,
  onDismiss: PropTypes.func,
  children: PropTypes.node
}
