import m from 'mithril'
import D from './models/Display'

const signals =  [
  ['T1', 'H1', 'C1', 'V1', 'V3', 'P1', 'P3', 'PWR'],
  ['T2', 'H2', 'C2', 'V2', 'V4', 'P2', 'FAN', 'LNV']
]

const c = {
  oninit: _ => {
    D.fetch()
  },
  view: _ => {
    return m('.flex-container--horizontal', [
      m('.flex-container__cell-3', [
        m('table',[
          m('tr', [
            m('th', 'Program'),
            m('td', D.name)
          ]),
          m('tr', [
            m('th', 'Cycle'),
            m('td', D.cycle)
          ]),
          m('tr', [
            m('th', 'Step'),
            m('td', D.step)
          ]),
          m('tr', [
            m('th', 'Timeleft'),
            m('td', D.timeLeft)
          ])
        ])
      ]),
      m('.flex-container__cell-7.flex-container--vertical', [
        m('.flex-container__cell-3.flex-container--horizontal', [
          m('.flex-container__cell.flex-container--vertical', [
            m('.flex-container__cell.centered-text', 'Thermometer'),
            m('.flex-container__cell-3.meter__container', [
              m('p.meter--large', D.dryTemperature)
            ])
          ]),
          m('.flex-container__cell.flex-container--vertical', [
            m('.flex-container__cell.centered-text', 'Humidity meter'),
            m('.flex-container__cell-3.meter__container', [
              m('p.meter--large', D.humidity)
            ])
          ])
        ]),
        m('.flex-container__cell-2.flex-container--horizontal', [
          m('.flex-container__cell-3'),
          m('.flex-container__cell-7.flex-container--vertical', [
            signals.map(row => {
              return m('.flex-container__cell.flex-container--horizontal', [
                row.map(item => {
                  return m('.signal-tag.flex-container__cell.centered-text',
                    { class: D.signals[item.toLowerCase()] == true ? 'signal-tag--active' : ''}, item)
                })
              ])
            })
          ])
        ])
      ])
    ])
  }
}

export default c
