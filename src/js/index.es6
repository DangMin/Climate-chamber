import m from 'mithril'
import domready from 'domready'
import io from 'socket.io-client'

import ProgramTable from 'components/programTable'
import SerialState from 'components/serialState'
import SegmentDisplay from 'components/segment-display'
import Programs from 'components/programs'

import {tabHandler} from 'global'

const socket = io('http://localhost:8080')

domready(() => {
  const components = {
    'program-table-js': ProgramTable,
    'serialport-state-js': SerialState,
    'programs-js': Programs
  }

  const thermoDisplay = new SegmentDisplay('thermo-display-js')
  const humidDisplay = new SegmentDisplay('humid-display-js')
  thermoDisplay.setValue('---.--')
  humidDisplay.setValue('---.--')

  tabHandler('navs__option')

  Object.keys(components).map(id => {
    const dom = document.getElementById(id)
    dom && m.mount(dom, components[id])
  })

  socket.on('update-display', data => {
    console.log(data)
  })
  socket.on('incoming', data => console.log(data))
})
