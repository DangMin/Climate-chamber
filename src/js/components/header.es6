import m from 'mithril'
import Serial from './models/serialState'

const c = {
  oninit: _ => {
    Serial.update
  },
  view: _ => {
    return [
      m('.header--left', [
        m('h1.header__title', 'CLIMATE CHAMBER')
      ])
    ]
  }
}

export default c
