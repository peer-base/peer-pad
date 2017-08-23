/* global it, expect, click */
import React from 'react'
import { mount } from 'enzyme'
import { createMemoryHistory } from 'history'
import { Router } from 'react-router'
import toJSON from 'enzyme-to-json'
import Home from './Home'

it('can create document via button', (done) => {
  const history = createMemoryHistory()
  const all = mount(
    <Router history={history}><Home /></Router>)

  const home = all.find(Home)
  expect(toJSON(home)).toMatchSnapshot()

  const unlisten = history.listen((location, action) => {
    expect(location.pathname).toMatch(/^\/w\/\w+\/\w+$/)
    unlisten()
    done()
  })

  const button = home.find('button').last()
  button.simulate('click', 1)
})


import { withRouter } from 'react-router-dom';

const myComponent = ({ listen }) => {

    listen((location, action) => {
        // location is an object like window.location
        console.log(action, location.pathname, location.state)
    });

    return <div>...</div>;
};

export default withRouter(myComponent);