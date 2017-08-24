import m from 'mithril'
import domready from 'domready'

import { socket } from './global'
import User from 'components/user'
import Header from 'components/header'
import Display from 'components/display'
import Navigator from 'components/navigator'
import Indicator from 'components/indicator'
import * as Error from 'components/indicators/errorIndicator'

import { tabHandler, formatDisplay } from 'global'

domready(() => {
  const components = {
    'js-user': User,
    'js-navs': Navigator,
    'js-header': Header,
    'js-display': Display,
    'js-indicator': Indicator,
  }

  tabHandler('navs__option')
  window.addEventListener('beforeunload', event => {
    socket.emit('disconnect-socket')
  })

  Object.keys(components).map(id => {
    const dom = document.getElementById(id)
    dom && m.mount(dom, components[id])
  })

  socket.on('incoming', data => console.log(data))
  socket.on('err', data => {
    Indicator.setTitle(Error.title).setBody(Error.body(data.msg)).show()
  })

  socket.on('program', data => {
    Indicator.setTitle(Error.title).setBody(Error.body(data.message)).show()
  })
})
