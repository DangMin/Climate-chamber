import m from 'mithril'
import Serial from './models/serialState'

const c = {
  view: _ => {
    return [
      m('.header--left', [
        m('h1.header__title', 'CLIMATE CHAMBER')
      ]),
      m('.header--right.serialport', [
        m('.serialport__state', [
          m('p', [
            m('span', 'Serial connection: '),
            m('i.fa.fa-2x', { class: Serial.state ? 'fa-check-circle' : 'fa-times-circle'})
          ])
        ]),
        m('.serialport__control', [
          !Serial.state ?
            m('button[type=button]', { onclick: Serial.reqConnection }, 'Connect') :
            m('button[type=button]', { onclick: Serial.disconnect }, 'Disconnect')
        ])
      ])
    ]
  }
}

export default c
