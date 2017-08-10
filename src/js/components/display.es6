import m from 'mithril'
// import SegmentDisplay from './segment-display'
import D from './models/Display'

const c = {
  oninit: _ => {
    D.fetch()
  },
  view: _ => {
    return [
      m('.display__program', [
        m('.display__table', [
          m('.display__tr', [
            m('.display__th', m('p', 'Program name:')),
            m('.display__td', m('p', D.name))
          ]),
          m('.display__tr', [
            m('.display__th', m('p', 'Cycles:')),
            m('.display__td', m('p', D.cycle))
          ]),
          m('.display__tr', [
            m('.display__th', m('p', 'Step:')),
            m('.display__td', m('p', D.step))
          ]),
          m('.display__tr', [
            m('.display__th', m('p', 'Time:')),
            m('.display__td', m('p', D.timeLeft))
          ])
        ])
      ]),
      m('.display__meters', [
        m('.display__meter', [
          m('.display__header', m('p', 'Thermometer')),
          m('.display__container', [
            m('p.meter--large', D.dryTemperature)
          ])
        ]),
        m('.display__meter', [
          m('.display__header', m('p', 'Humidity meter')),
          m('.display__container', [
            m('p.meter--large', D.humidity)
          ])
        ])
      ]),
      m('.display__status')
    ]
  }
}

export default c
