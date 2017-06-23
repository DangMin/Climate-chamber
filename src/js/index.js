import m from 'mithril'
import ProgramTable from 'components/programTable'
import SerialState from 'components/serialState'
import domready from 'domready'

domready(() => {
  const components = {
    'program-table-js': ProgramTable,
    'serialport-state-js': SerialState
  }

  Object.keys(components).map(id => {
    const dom = document.getElementById(id)
    console.log(components[id])
    dom && m.mount(dom, components[id])
  })
})
