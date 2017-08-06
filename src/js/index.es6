import m from 'mithril'
import domready from 'domready'
import io from 'socket.io-client'

import User from 'components/user'
import Header from 'components/header'
import Display from 'components/display'
import Navigator from 'components/navigator'
import Indicator from 'components/indicator'

import { tabHandler, formatDisplay } from 'global'

const socket = io('http://localhost:8080')

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
})
