import m from 'mithril'
import P from './models/Pids'
import { isEmpty } from 'lodash'

const headers = ['', 'Proportional', 'Integral', 'Derivative']
const c = {
  oninit: vnode => {
    P.fetch()
  },
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
          m('.table__body', { onclick: P.flushPid.bind(event, 'temperature') }, [
            !isEmpty(P.list.temp) ? P.list.temp.map(item => {
              return m(`.table__row[data-id=${item._id}][data-type=${item.type}]`, {
                class: P.current[item.type] && item._id === P.current[item.type]._id ? 'pid--active' : '',
                onclick: P.current[item.type] && item._id === P.current[item.type]._id ? P.flushPid.bind(event, item.type) : P.choosePid.bind(event)
              }, [
                m('.table__cell.centered-text', item.default ? m('i.fa.fa-check') : ''),
                m('.table__cell-2.centered-text', item.proportional),
                m('.table__cell-2.centered-text', item.integral),
                m('.table__cell-2.centered-text', item.derivative)
              ])
            }) : m('.center-container', [
              m('p', 'No PID has been set')
            ])
          ]),
          m('.pid__form-container', P.form.temp ? { class: 'pid__form-container--active flex-container--horizontal' } : {}, [
            P.form.temp ? m('form#js-temp-pid.flex-container--horizontal', [
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
                m('button', { onclick: P.addPid.bind(event, 'js-temp-pid')}, m('i.fa.fa-check')),
                m('button', { onclick: P.cancelForm.bind(event, 'temp')}, m('i.fa.fa-times'))
              ])
            ]) : m('div')
          ]),
          m('.table__footer', [
            m('.button__group', [
              m('button', { onclick: P.activateForm.bind(event, 'temp') }, 'Add'),
              m('button', {
                onclick: P.setDefault.bind(event, 'temperature'),
                disabled: P.current.temperature ? false : true
              }, 'Set as Default'),
              m('button', {
                onclick: P.removePid.bind(event, 'temperature'),
                disabled: P.current.temperature ? false : true
              }, 'Remove')
            ])
          ])
        ])
      ]),
      m('.pid', [
        m('.table', [
          m('.table__header', [
            m('.table__row', [
              headers.map(header => {
                return header != '' ? m('.table__cell-3.centered-text.pid__header', header) : m('.table__cell')
              })
            ])
          ]),
          m('.table__body', { onclick: P.flushPid.bind(event, 'humidity') }, [
            !isEmpty(P.list.humid) ? P.list.humid.map(item => {
              return m(`.table__row[data-id=${item._id}][data-type=${item.type}]`, {
                class: P.current[item.type] && item._id === P.current[item.type]._id ? 'pid--active' : '',
                onclick: P.current[item.type] && item._id === P.current[item.type]._id ? P.flushPid.bind(event, item.type) : P.choosePid.bind(event)
              }, [
                m('.table__cell.centered-text', item.default ? m('i.fa.fa-check') : ''),
                m('.table__cell-2.centered-text', item.proportional),
                m('.table__cell-2.centered-text', item.integral),
                m('.table__cell-2.centered-text', item.derivative)
              ])
            }) : m('.center-container', [
              m('p', 'No PID has been set')
            ])
          ]),
          m('.pid__form-container', P.form.humid ? { class: 'pid__form-container--active flex-container--horizontal' } : {}, [
            P.form.humid ? m('form#js-humid-pid.flex-container--horizontal', [
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
                m('button', { onclick: P.addPid.bind(event, 'js-humid-pid')}, m('i.fa.fa-check')),
                m('button', { onclick: P.cancelForm.bind(event, 'humid')}, m('i.fa.fa-times'))
              ])
            ]) : m('div')
          ]),
          m('.table__footer', [
            m('.button__group', [
              m('button', { onclick: P.activateForm.bind(event, 'humid')}, 'Add'),
              m('button', {
                onclick: P.setDefault.bind(event, 'humidity'),
                disabled: P.current.humidity ? false : true
              }, 'Set as Default'),
              m('button', {
                onclick: P.removePid.bind(event, 'humidity'),
                disabled: P.current.humidity ? false : true
              }, 'Remove')
            ])
          ])
        ])
      ])
    ]
  }
}

export default c
