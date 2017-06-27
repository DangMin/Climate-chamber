import m from 'mithril'
import domready from 'domready'

import ProgramTable from 'components/programTable'
import SerialState from 'components/serialState'
import SegmentDisplay from 'components/segment-display'

import {tabHandler} from 'global'

const socket = io('http://localhost:8080')

domready(() => {
  const components = {
    'program-table-js': ProgramTable,
    'serialport-state-js': SerialState
  }
  const thermoDisplay = SegmentDisplay('thermo-display-js')
  const humidDisplay = SegmentDisplay('humid-display-js')

  tabHandler('tab_navs')

  Object.keys(components).map(id => {
    const dom = document.getElementById(id)
    dom && m.mount(dom, components[id])
  })

  socket.on('update-display', data => {
    console.log(data)
  })
})
