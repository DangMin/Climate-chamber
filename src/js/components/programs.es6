import m from 'mithril'
import P from './models/Programs'
import { formatDate } from '../global'

const c = {
  oninit: (vnode) => {
    P.fetch()
  },
  view: () => {
    return m('.container-fluid', [
      m('.row.programs', [
        m('.col-md-3.programs__list', [
          // P list.
          m('.programs__table--container', [
            m('table.programs__table', [
              P.list.map(prgm => {
                const cday = formatDate(new Date(prgm.createdAt))
                const uday = formatDate(new Date(prgm.updatedAt))
                return m('tr.programs__table--row', [
                  m(`td[data-id=${prgm._id}]`, {onclick:P.chooseProgram.bind(event, prgm._id), class: P.currentProgram && P.currentProgram._id == prgm._id ? 'programs--active' : ''}, [
                    m('p.programs__name', prgm.name),
                    m('p.programs__details', `Cycles: ${prgm.cycles}`),
                    m('p.programs__details', `Date created: ${cday} - Last updated: ${uday}`)
                  ])
                ])
              })
            ])
          ]),
          m('.programs__form-container#form-program-js', {class: P.isPrgmForm ? 'programs__form-container--active' : ''}, [
            P.isPrgmForm ? ( P.formType == 'add' ?
              m('form.programs__form', [
                m('input[type=text][name=name][placeholder="Program\'s name"]'),
                m('input[type=number][name=cycles][placeholder="Cycles"]'),
                m('.button__group', [
                  m('button', {onclick: P.addProgram.bind(event)}, 'Add'),
                  m('button', {onclick: P.cancelForm.bind(event)}, 'Cancel')
                ])
              ]) : P.formType == 'edit' ?
                m('form.programs__form', [
                  m(`input[type=hidden][name=_id][value=${P.currentProgram._id}]`),
                  m(`input[type=text][name=name][value=${P.currentProgram.name}]`),
                  m(`input[type=text][name=cycles][value=${P.currentProgram.cycles}]`),
                  m('.button__group', [
                    m('button', {onclick: P.editProgram.bind(event)}, 'Confirm'),
                    m('button', {onclick: P.cancelForm.bind(event)}, 'Cancel')
                  ])
                ]): ''
            ) : ''
          ]),
          m('.programs__handles', [
            m('button.programs__handles--button',
              { onclick: P.addFormSignal.bind(event, 'add'), disabled: !P.isPrgmForm ? false : true },
              m('i.fa.fa-plus-circle'), ' Add'),
            m('button.programs__handles--button', m('i.fa.fa-download'), ' Load'),
            m('button.programs__handles--button',
              { onclick: P.addFormSignal.bind(event, 'edit'), disabled: !P.currentProgram ? true : false }, m('i.fa.fa-edit'), 'Edit'),
            m('button.programs__handles--button',
              { onclick: P.rmPrgm.bind(event, P.currentProgram), disabled: !P.currentProgram ? true : false }, m('i.fa.fa-minus-circle'), ' Remove')
          ])
        ]),
        m('.col-md-9.steps__table', [
          m('.row.steps__table--header', [
            m('.col-md-1.steps__table--header-cell.txt--vertical', 'Order'),
            m('.col-md-2.steps__table--header-cell.txt--vertical', 'Temperature'),
            m('.col-md-2.steps__table--header-cell.txt--vertical', 'Humidity'),
            m('.col-md-1.steps__table--header-cell.txt--vertical', 'Time'),
            m('.col-md-1.steps__table--header-cell.txt--vertical', 'Wait'),
            m('.col-md-2.steps__table--header-cell.no-gutters', [
              m('.row', {style: 'border-bottom:1px solid #eee;'}, [
                m('.col-md-12', 'Options')
              ]),
              m('.row', [
                m('.col-md-4', {style: 'border-right:1px solid #eee;'}, '1'),
                m('.col-md-4', '2'),
                m('.col-md-4', {style: 'border-left:1px solid #eee;'}, '3')
              ])
            ]),
            m('.col-md-3.steps__table--header-cell.txt--vertical', 'Action')
          ]),
          m('.steps__table--body', [
            m('.row.steps__table--row', [
              m('.col-md-1.steps__table--cell', '1'),
              m('.col-md-2.steps__table--cell', '120'),
              m('.col-md-2.steps__table--cell', '50'),
              m('.col-md-1.steps__table--cell', '1:30'),
              m('.col-md-1.steps__table--cell', '1:00'),
              m('.col-md-2.steps__table--cell.row.no-gutters', [
                m('.col-md-4', m('i.fa.fa-check')),
                m('.col-md-4', m('i.fa.fa-times')),
                m('.col-md-4', m('i.fa.fa-check'))
              ]),
              m('.col-md-3.steps__table--cell.steps__action.no-gutters', [
                m('button.steps__table--button', m('i.fa.fa-trash')),
                m('button.steps__table--button', m('i.fa.fa-edit'))
              ])
            ]),
            m('.row.steps__table--row', [
              m('.col-md-1.steps__table--cell', '1'),
              m('.col-md-2.steps__table--cell', '120'),
              m('.col-md-2.steps__table--cell', '50'),
              m('.col-md-1.steps__table--cell', '1:30'),
              m('.col-md-1.steps__table--cell', '1:00'),
              m('.col-md-2.steps__table--cell.row.no-gutters', [
                m('.col-md-4', m('i.fa.fa-check')),
                m('.col-md-4', m('i.fa.fa-times')),
                m('.col-md-4', m('i.fa.fa-check'))
              ]),
              m('.col-md-3.steps__table--cell.steps__action.no-gutters', [
                m('button.steps__table--button', m('i.fa.fa-trash')),
                m('button.steps__table--button', m('i.fa.fa-edit'))
              ])
            ]),
            m('.row.steps__table--row', [
              m('.col-md-1.steps__table--cell', '1'),
              m('.col-md-2.steps__table--cell', '120'),
              m('.col-md-2.steps__table--cell', '50'),
              m('.col-md-1.steps__table--cell', '1:30'),
              m('.col-md-1.steps__table--cell', '1:00'),
              m('.col-md-2.steps__table--cell.row.no-gutters', [
                m('.col-md-4', m('i.fa.fa-check')),
                m('.col-md-4', m('i.fa.fa-times')),
                m('.col-md-4', m('i.fa.fa-check'))
              ]),
              m('.col-md-3.steps__table--cell.steps__action.no-gutters', [
                m('button.steps__table--button', m('i.fa.fa-trash')),
                m('button.steps__table--button', m('i.fa.fa-edit'))
              ])
            ]),
            m('.row.steps__table--row', [
              m('.col-md-1.steps__table--cell', '1'),
              m('.col-md-2.steps__table--cell', '120'),
              m('.col-md-2.steps__table--cell', '50'),
              m('.col-md-1.steps__table--cell', '1:30'),
              m('.col-md-1.steps__table--cell', '1:00'),
              m('.col-md-2.steps__table--cell.row.no-gutters', [
                m('.col-md-4', m('i.fa.fa-check')),
                m('.col-md-4', m('i.fa.fa-times')),
                m('.col-md-4', m('i.fa.fa-check'))
              ]),
              m('.col-md-3.steps__table--cell.no-gutters', [
                m('button.steps__table--button', m('i.fa.fa-trash')),
                m('button.steps__table--button', m('i.fa.fa-edit'))
              ])
            ])
          ]),
          m('.steps__table--footer', [
            m('p.steps__table--status', 'Program last for 30 hour 15 minutes, including 3 cycles.'),
            m('.steps__handles', [
              m('button.steps__handles--button', m('i.fa.fa-plus-circle'), ' Add'),
              m('button.steps__handles--button', m('i.fa.fa-edit'), ' Edit'),
              m('button.steps__handles--button', m('i.fa.fa-minus-circle', ' Remove'))
            ])
          ])
        ])
      ])
    ])
  }
}

export default c
