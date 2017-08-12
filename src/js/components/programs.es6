import m from 'mithril'
import P from './models/Programs'
import { formatDate } from '../global'

const c = {
  oninit: vnode => {
    P.fetch()
  },
  view: _ => {
    return [
      m('.programs', [
        m('.programs__container', [
          m('table.programs__table', [
            P.list.map(prgm => {
              const cday = formatDate(new Date(prgm.createdAt))
              const uday = formatDate(new Date(prgm.updatedAt))
              return m('tr.', [
                m(`td[data-id=${prgm._id}]`, { onclick:P.chooseProgram.bind(event, prgm._id), class: P.currentProgram && P.currentProgram._id == prgm._id ? 'programs--active' : '' }, [
                  m('p.programs__name', prgm.name),
                  m('p.programs__details', `Cycles: ${prgm.cycles}`),
                  m('p.programs__details', `Date created: ${cday} - Last updated: ${uday}`)
                ])
              ])
            })
          ])
        ]),
        m('.programs__form-container#form-program-js', {class: P.isPrgmForm ? 'programs__form-container--active' : ''}, [
          P.isPrgmForm ?
            m('form.programs__form', [
              P.currentProgram ? m(`input[type=hidden][name=_id][value=${P.currentProgram._id}]`) : m('div'),
              m('input[type=text][name=name]', P.currentProgram ? { value: P.currentProgram.name } : { placeholder: 'Program\s name'} ),
              m('input[type=number][name=cycles]', P.currentProgram ? { value: P.currentProgram.cycles } : { placeholder: 'Cycles' }),
              m('.button__group', [
                m('button', {onclick: P.currentProgram ? P.editProgram.bind(event) : P.addProgram.bind(event)}, m('i.fa.fa-check')),
                m('button', {onclick: P.cancelForm.bind(event)}, m('i.fa.fa-times'))
              ])
            ])  : ''
        ]),
        m('.programs__handles', [
          m('.button__group' ,[
            m('button.programs__handles--button',
              { onclick: P.addFormSignal.bind(event, null), disabled: !P.isPrgmForm ? false : true },
              m('i.fa.fa-plus-circle')),
            m('button.programs__handles--button', m('i.fa.fa-download')),
            m('button.programs__handles--button',
              { onclick: P.addFormSignal.bind(event, P.currentProgram ? P.currentProgram._id : null), disabled: !P.currentProgram ? true : false }, m('i.fa.fa-edit')),
            m('button.programs__handles--button',
              { onclick: P.rmPrgm.bind(event, P.currentProgram ? P.currentProgram._id : null), disabled: !P.currentProgram ? true : false }, m('i.fa.fa-minus-circle'))
          ]),
          m('.button__group', [
            m('button.programs__handles--button', {
              onclick: P.startProgram.bind(event),
              disabled: P.currentProgram ? false : true
            }, 'Start'),
            m('button.programs__handles--button', {
              onclick: P.stopProgram.bind(event),
              disabled: P.currentProgram ? false : true
            },'Stop')
          ])
        ])
      ]),
      m('.steps__list.table', [
        m('.table__header', m('.table__row', [
          m('.table__cell.centered-text', 'Order'),
          m('.table__cell-2.centered-text', 'Temperature'),
          m('.table__cell-2.centered-text', 'Humidity'),
          m('.table__cell-2.centered-text', 'Time'),
          m('.table__cell-2.centered-text', 'Wait'),
          m('.table__cell-stacked.table__cell-3', [
            m('.table__cell.centered-text', 'Options'),
            m('.table__cell.table__cell-queued', [
              m('.table__cell.centered-text', '1'),
              m('.table__cell.centered-text', '2'),
              m('.table__cell.centered-text', '3')
            ])
          ]),
          m('.table__cell-2.centered-text', 'Actions')
        ])),
        m('.table__body', [
          P.stepList.length !== 0 ? P.stepList.map(step => {
            return m('.table__row', [
              m('.table__cell.centered-text', step.order),
              m('.table__cell-2.centered-text', step.temperature),
              m('.table__cell-2.centered-text', step.humidity),
              m('.table__cell-2.centered-text', step.time),
              m('.table__cell-2.centered-text', step.wait),
              m('.table__cell-3.table__cell-queued', step.options.map(opt => {
                return m('.table__cell.centered-text', opt === 'true' ? m('i.fa.fa-check') : m('i.fa.fa-times'))
              })),
              m('.table__cell-2.button__group', [
                m('button.steps__button', { onclick: P.addStepForm.bind(event, step._id)}, m('i.fa.fa-edit')),
                m('button.steps__button', { onclick: P.removeStep.bind(event, step._id )}, m('i.fa.fa-trash'))
              ])
            ])
          }) : m('.center-container', [
            m('p', 'This program has no step.')
          ])
        ]),
        m('#step-form-js.steps__form-container.flex-container--horizontal',
          { class: P.isStepForm ? 'steps__form-container--active' : '' }, [
            P.currentProgram && P.isStepForm ?
              m('form', [
                m('input[type=hidden][name=program_id]', { value: P.currentProgram ? P.currentProgram._id : '' }),
                P.currentStep ? m('input[type=hidden][name=_id]', { value: P.currentStep._id }) : '',
                P.currentStep ? m('input[type=hidden][name=order]', { value: P.currentStep.order }) : '',
                m('.flex-container--horizontal', [
                  m('.flex-container__cell', '--'),
                  m('.flex-container__cell-2', [
                    m('input[type=number][name=temperature][required].flex-container__cell-2', P.currentStep ? { value: P.currentStep.temperature } : { placeholder: 'Temperature' })
                  ]),
                  m('.flex-container__cell-2', [
                    m('input[type=number][name=humidity][required].flex-container__cell-2', P.currentStep ? { value: P.currentStep.humidity } : { placeholder: 'Humidity' })
                  ]),
                  m('.flex-container__cell-2', [
                    m('input[type=text][name=time][required].flex-container__cell-2', P.currenStep ? { value: P.currentStep.time } : { placeholder: 'Time: hh:mm' })
                  ]),
                  m('.flex-container__cell-2', [
                    m('input[type=text][name=wait].flex-container__cell-2', P.currentStep ? { value: P.currentStep.wait } : { placeholder: 'Wait: hh:mm' })
                  ]),
                  m('.checkbox--group.flex-container__cell-3',
                    P.currentStep ? P.currentStep.options.map(opt => {
                      return m('input.flex-container__cell[type=checkbox][name="options[]"][value=true]', { checked: opt === true || opt === 'true' ? true : false })
                    }) : [
                      m('input[type=checkbox][name="options[]"][value=true].flex-container__cell'),
                      m('input[type=checkbox][name="options[]"][value=true].flex-container__cell'),
                      m('input[type=checkbox][name="options[]"][value=true].flex-container__cell')
                    ]
                  ),
                  m('.button__group.flex-container__cell-2', [
                    P.currentStep ? m('button', { onclick: P.editStep.bind(event, P.currentStep._id) }, m('i.fa.fa-edit')) :
                      m('button', { onclick: P.addStep.bind(event) }, m('i.fa.fa-plus')),
                    m('button', { onclick: P.cancelStepForm }, m('i.fa.fa-times'))
                  ])
                ])
              ]): ''
          ]),
        m('.table__footer.steps__footer', [
          m('.steps__status.center-container', [
            m('p', 'Program lasts for 30 hours 15 minutes.')
          ]),
          m('.steps__handles.center-container', [
            m('button[type=button]', { onclick: P.addStepForm.bind(event, null), disabled: P.currentProgram && !P.isStepForm ? false : true }, m('i.fa.fa-plus'))
          ])
        ])
      ])
    ]
  }
}

export default c
