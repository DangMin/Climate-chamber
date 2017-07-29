import m from 'mithril'
import P from './models/pid'

const headers = ['', 'Proportional', 'Integral', 'Derivative']
const c = {
  view: _ => {
    return [
      m('.pid', [
        m('.table', [
          m('.table__header', [
            m('.table__row', [
              headers.map(header => {
                return header != '' ? m('.table__cell-3.centered-text.pid__header', header) : m('.table__cell')
              })
            ])
          ]),
          m('.table__body', [
            m('.center-container', [
              m('p', 'No PID has been set')
            ])
          ]),
          m('.pid__form-container', P.form.temp ? { class: 'pid__form-container--active flex-container--horizontal' } : {}, [
            P.form.temp ? m('form.flex-container--horizontal', [
              m('input[type=hidden][name=type][value=temperature]'),
              m('.flex-container__cell.center-container', [
                m('input[type=checkbox][name=default][value=true]')
              ]),
              m('.flex-container__cell-2.center-container', [
                m('input[type=number][name=proportional][placeholder=Proportional]')
              ]),
              m('.flex-container__cell-2.center-container', [
                m('input[type=number][name=integral][placeholder=Integral]')
              ]),
              m('.flex-container__cell-2.center-container', [
                m('input[type=number][name=derivative][placeholder=Derivative]')
              ]),
              m('.flex-container__cell-2.button__group', [
                m('button', m('i.fa.fa-check')),
                m('button', { onclick: P.cancelForm.bind(event, 'temp')}, m('i.fa.fa-times'))
              ])
            ]) : m('div')
          ]),
          m('.table__footer', [
            m('.button__group', [
              m('button', { onclick: P.activateForm.bind(event, 'temp') }, 'Add'),
              m('button', 'Set as Default'),
              m('button', 'Remove')
            ])
          ])
        ])
      ]),
      m('.pid', [
        m('.table', [
          m('.table__header', [
            m('.table__row', [
              headers.map(header => {
                return m('.table__cell.centered-text.pid__header', header)
              })
            ])
          ]),
          m('.table__body', [
            m('.center-container', [
              m('p', 'No PID has been set')
            ])
          ]),
          m('.pid__form-container', P.form.humid ? { class: 'pid__form-container--active flex-container--horizontal' } : {}, [
            P.form.humid ? m('form.flex-container--horizontal', [
              m('input[type=hidden][name=type][value=humidity]'),
              m('.flex-container__cell.center-container', [
                m('input[type=checkbox][name=default][value=true]')
              ]),
              m('.flex-container__cell-2.center-container', [
                m('input[type=number][name=proportional][placeholder=Proportional]')
              ]),
              m('.flex-container__cell-2.center-container', [
                m('input[type=number][name=integral][placeholder=Integral]')
              ]),
              m('.flex-container__cell-2.center-container', [
                m('input[type=number][name=derivative][placeholder=Derivative]')
              ]),
              m('.flex-container__cell-2.button__group', [
                m('button', m('i.fa.fa-check')),
                m('button', { onclick: P.cancelForm.bind(event, 'humid')}, m('i.fa.fa-times'))
              ])
            ]) : m('div')
          ]),
          m('.table__footer', [
            m('.button__group', [
              m('button', { onclick: P.activateForm.bind(event, 'humid')}, 'Add'),
              m('button', 'Set as Default'),
              m('button', 'Remove')
            ])
          ])
        ])
      ])
    ]
  }
}

export default c
