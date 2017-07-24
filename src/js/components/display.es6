import m from 'mithril'
import SegmentDisplay from './segment-display'

const c = {
  oncreate: _ => {
    const thermoDisplay = new SegmentDisplay('thermo-display-js')
    const humidDisplay = new SegmentDisplay('humid-display-js')
    thermoDisplay.setValue('---.--')
    humidDisplay.setValue('---.--')
  },
  view: _ => {
    return [
      m('.display__program', [
        m('.display__table', [
          m('.display__tr', [
            m('.display__th', m('p', 'Program name:')),
            m('.display__td', m('p', 'Misterious program'))
          ]),
          m('.display__tr', [
            m('.display__th', m('p', 'Cycles:')),
            m('.display__td', m('p', '5'))
          ]),
          m('.display__tr', [
            m('.display__th', m('p', 'Step:')),
            m('.display__td', m('p', '4'))
          ]),
          m('.display__tr', [
            m('.display__th', m('p', 'Time:')),
            m('.display__td', m('p', '00:00'))
          ])
        ])
      ]),
      m('.display__meters', [
        m('.display__meter', [
          m('.display__header', m('p', 'Thermometer')),
          m('canvas#thermo-display-js')
        ]),
        m('.display__meter', [
          m('.display__header', m('p', 'Humidity meter')),
          m('canvas#humid-display-js')
        ])
      ]),
      m('.display__status')
    ]
  }
}

export default c
