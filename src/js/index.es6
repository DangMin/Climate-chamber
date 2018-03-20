import m from 'mithril'
import domready from 'domready'

import { socket } from './global'
import Header from 'components/header'
import Display from 'components/display'
import Navigator from 'components/navigator'
import Indicator from 'components/indicator'
import Status from 'components/status'
import * as Error from 'components/indicators/errorIndicator'

import { tabHandler, formatDisplay } from 'global'

domready(() => {
  const components = {
    'js-navs': Navigator,
    'js-header': Header,
    'js-indicator': Indicator,
    'js-status': Status
  }

  tabHandler('navs__option')
  window.addEventListener('beforeunload', event => {
    socket.emit('disconnect-socket')
  })

  Object.keys(components).map(id => {
    const dom = document.getElementById(id)
    dom && m.mount(dom, components[id])
  })

  socket.on('err', data => {
    Indicator.setTitle(Error.title).setBody(Error.body(data.msg)).show()
  })

  socket.on('program', data => {
    Indicator.setTitle(Error.title).setBody(Error.body(data.message)).show()
  })
})
