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
        m('.col-md-9.steps__table.flexbox.flexbox--column', [
          m('.row.steps__table--header.flexbox.flexbox--row', [
            m('.flexbox__cell.flexbox__cell-1', m('p', 'Order')),
            m('.flexbox__cell.flexbox__cell-2', m('p', 'Temperature')),
            m('.flexbox__cell.flexbox__cell-2', m('p', 'Humidity')),
            m('.flexbox__cell.flexbox__cell-2', m('p', 'Time')),
            m('.flexbox__cell.flexbox__cell-2', m('p', 'Wait')),
            m('.flexbox__cell.flexbox__cell-3.flexbox--column', [
              m('.flexbox__cell.flexbox__cell-1', m('p', 'Options')),
              m('.flexbox__cell.flexbox__cell-1.flexbox.flexbox--row', [
                m('.flexbox__cell.flexbox__cell-1', m('p', '1')),
                m('.flexbox__cell.flexbox__cell-1', m('p', '2')),
                m('.flexbox__cell.flexbox__cell-1', m('p', '3'))
              ])
            ]),
            m('.flexbox__cell.flexbox__cell-2', 'Actions')
          ]),
          m('.steps__table--body', [
            m('.steps__table--row.flexbox--row.flexbox', [
              m('.flexbox__cell.flexbox__cell-1', '1'),
              m('.flexbox__cell.flexbox__cell-2', '150'),
              m('.flexbox__cell.flexbox__cell-2', '89'),
              m('.flexbox__cell.flexbox__cell-2', '1:30'),
              m('.flexbox__cell.flexbox__cell-2', 'none'),
              m('.flexbox__cell.flexbox__cell-3.flexbox--row.flexbox', [
                m('.flexbox__cell.flexbox__cell-1', m('i.fa.fa-check')),
                m('.flexbox__cell.flexbox__cell-1', m('i.fa.fa-times')),
                m('.flexbox__cell.flexbox__cell-1', m('i.fa.fa-times'))
              ]),
              m('.flexbox__cell.flexbox__cell-2', [
                m('button.steps__table--button', {}, m('i.fa.fa-trash')),
                m('button.steps__table--button', {}, m('i.fa.fa-edit'))
              ]),
            ]),
            m('.steps__table--row.flexbox--row.flexbox', [
              m('.flexbox__cell.flexbox__cell-1', '1'),
              m('.flexbox__cell.flexbox__cell-2', '150'),
              m('.flexbox__cell.flexbox__cell-2', '89'),
              m('.flexbox__cell.flexbox__cell-2', '1:30'),
              m('.flexbox__cell.flexbox__cell-2', 'none'),
              m('.flexbox__cell.flexbox__cell-3.flexbox--row.flexbox', [
                m('.flexbox__cell.flexbox__cell-1', m('i.fa.fa-check')),
                m('.flexbox__cell.flexbox__cell-1', m('i.fa.fa-times')),
                m('.flexbox__cell.flexbox__cell-1', m('i.fa.fa-times'))
              ]),
              m('.flexbox__cell.flexbox__cell-2', [
                m('button.steps__table--button', {}, m('i.fa.fa-trash')),
                m('button.steps__table--button', {}, m('i.fa.fa-edit'))
              ]),
            ]),
            m('.steps__table--row.flexbox--row.flexbox', [
              m('.flexbox__cell.flexbox__cell-1', '1'),
              m('.flexbox__cell.flexbox__cell-2', '150'),
              m('.flexbox__cell.flexbox__cell-2', '89'),
              m('.flexbox__cell.flexbox__cell-2', '1:30'),
              m('.flexbox__cell.flexbox__cell-2', 'none'),
              m('.flexbox__cell.flexbox__cell-3.flexbox--row.flexbox', [
                m('.flexbox__cell.flexbox__cell-1', m('i.fa.fa-check')),
                m('.flexbox__cell.flexbox__cell-1', m('i.fa.fa-times')),
                m('.flexbox__cell.flexbox__cell-1', m('i.fa.fa-times'))
              ]),
              m('.flexbox__cell.flexbox__cell-2', [
                m('button.steps__table--button', {}, m('i.fa.fa-trash')),
                m('button.steps__table--button', {}, m('i.fa.fa-edit'))
              ]),
            ]),
            m('.steps__table--row.flexbox--row.flexbox', [
              m('.flexbox__cell.flexbox__cell-1', '1'),
              m('.flexbox__cell.flexbox__cell-2', '150'),
              m('.flexbox__cell.flexbox__cell-2', '89'),
              m('.flexbox__cell.flexbox__cell-2', '1:30'),
              m('.flexbox__cell.flexbox__cell-2', 'none'),
              m('.flexbox__cell.flexbox__cell-3.flexbox--row.flexbox', [
                m('.flexbox__cell.flexbox__cell-1', m('i.fa.fa-check')),
                m('.flexbox__cell.flexbox__cell-1', m('i.fa.fa-times')),
                m('.flexbox__cell.flexbox__cell-1', m('i.fa.fa-times'))
              ]),
              m('.flexbox__cell.flexbox__cell-2', [
                m('button.steps__table--button', {}, m('i.fa.fa-trash')),
                m('button.steps__table--button', {}, m('i.fa.fa-edit'))
              ]),
            ]),
          ]),
          m('#form-step-js.steps__table--form-container.steps__table--form-container--active',
            { }, [
              m('form', [
                m('input[type=hidden][name=program_id][value=empty]'),
                m('.flexbox.flexbox--row', [
                  m('.flexbox__cell.flexbox__cell-1'),
                  m('.flexbox__cell.flexbox__cell-2', [
                    m('input[type=number][name=temperature][required][placeholder="Temperature"]')
                  ]),
                  m('.flexbox__cell.flexbox__cell-2', [
                    m('input[name=humidity][type=number][placeholder=Humidity]')
                  ]),
                  m('.flexbox__cell.flexbox__cell-2', [
                    m('input[name=time][type=text][placeholder=Time]')
                  ]),
                  m('.flexbox__cell.flexbox__cell-2', [
                    m('input[name=wait][type=text][placeholder=Wait]', 'Wait')
                  ]),
                  m('.flexbox__cell.flexbox__cell-3.flexbox.flexbox--row', [
                    m('.flexbox__cell.flexbox__cell-1', [
                      m('input[type=checkbox]', { name: 'options' })
                    ]),
                    m('.flexbox__cell.flexbox__cell-1', [
                      m('input[type=checkbox]', { name: 'options' })
                    ]),
                    m('.flexbox__cell.flexbox__cell-1', [
                      m('input[type=checkbox]', { name: 'options' })
                    ])
                  ]),
                  m('.flexbox__cell.flexbox__cell-2', [
                    m('.button__group', [
                      m('button.steps__table--button', {  }, m('i.fa.fa-check')),
                      m('button.steps__table--button', {  }, m('i.fa.fa-times'))
                    ])
                  ])
                ])
              ])
              // P.currentProgram && P.isStepForm ?
              //   ( P.stepFormType == 'add' ?
              //     m('form', [
              //       m(`input[type=hidden][name=program_id][value=${P.currentProgram._id}]`),
              //       m('.flexbox.flexbox--row', [
              //         m('.flexbox__cell.flexbox__cell-1'),
              //         m('.flexbox__cell.flexbox__cell-2', [
              //           m('input[type=number][name=temperature][required][placeholder="Temperature"]')
              //         ]),
              //         m('.flexbox__cell.flexbox__cell-2', [
              //           m('input[name=humidity][type=number][placeholder=Humidity]')
              //         ]),
              //         m('.flexbox__cell.flexbox__cell-2', [
              //           m('input[name=time][type=text][placeholder=Time]')
              //         ]),
              //         m('.flexbox__cell.flexbox__cell-2', [
              //           m('input[name=wait][type=text][placeholder=Wait]', 'Wait')
              //         ]),
              //         m('.flexbox__cell.flexbox__cell-3.flexbox.flexbox--row', [
              //           m('.flexbox__cell.flexbox__cell-1', [
              //             m('input[type=checkbox]', { name: 'options' })
              //           ]),
              //           m('.flexbox__cell.flexbox__cell-1', [
              //             m('input[type=checkbox]', { name: 'options' })
              //           ]),
              //           m('.flexbox__cell.flexbox__cell-1', [
              //             m('input[type=checkbox]', { name: 'options' })
              //           ])
              //         ]),
              //         m('.flexbox__cell.flexbox__cell-2', [
              //           m('.button__group', [
              //             m('button.steps__table--button', { onclick: P.addStep.bind(event) }, m('i.fa.fa-check')),
              //             m('button.steps__table--button', { onclick: P.cancelStepForm.bind(event) }, m('i.fa.fa-times'))
              //           ])
              //         ])
              //       ])
              //     ]) : (P.stepFormType == 'edit' ?
              //       m('form', [
              //         m(`input[name=program_id][type=hidden][value=${P.currentProgram._id}]`),
              //         m(`input[name=_id][type=hidden][value=${P.currentStep._id}]`),
              //         m('.flexbox.flexbox--row', [
              //           m('.flexbox__cell.flexbox__cell-1'),
              //           m('.flexbox__cell.flexbox__cell-2', [
              //             m(`input[type=number][name=temperature][required][value=${P.currentStep.temperature}]`)
              //           ]),
              //           m('.flexbox__cell.flexbox__cell-2', [
              //             m(`input[name=humidity][type=number][required][value=${P.currentStep.humidity}]`)
              //           ]),
              //           m('.flexbox__cell.flexbox__cell-2', [
              //             m(`input[name=time][type=text][required][value=${P.currentStep.time}]`)
              //           ]),
              //           m('.flexbox__cell.flexbox__cell-2', [
              //             m(`input[name=wait][type=text][required][value=${P.currentStep.wait}]`)
              //           ]),
              //           m('.flexbox__cell.flexbox__cell-3.flexbox.flexbox--row', [
              //             m('.flexbox__cell.flexbox__cell-1', [
              //               m(`input[name=options][type=checkbox][value=${P.currentStep.options[0]}]`)
              //             ]),
              //             m('.flexbox__cell.flexbox__cell-1', [
              //               m(`input[name=options][type=checkbox][value=${P.currentStep.options[1]}]`)
              //             ]),
              //             m('.flexbox__cell.flexbox__cell-1', [
              //               m(`input[name=options][type=checkbox][value=${P.currentStep.options[2]}]`)
              //             ])
              //           ]),
              //           m('.flexbox__cell.flexbox__cell-2', [
              //             m('.button__group', [
              //               m('button.steps__table--button', {}, m('i.fa.fa-check')),
              //               m('button.steps__table--button', {}, m('i.fa.fa-times'))
              //             ])
              //           ])
              //         ])
              //       ]) : '')) : ''
            ]),
          m('.steps__table--footer', [
            m('p.steps__table--status', 'Program last for 30 hour 15 minutes, including 3 cycles.'),
            m('.steps__handles', [
              m('button.steps__handles--button',
                { //onclick: P.addStepForm.bind(event, 'add'), disabled: !P.isStepForm && P.currentProgram ? false : true
                },
                m('i.fa.fa-plus-circle'), ' Add')
            ])
          ])
        ])
      ])
    ])
  }
}

export default c
