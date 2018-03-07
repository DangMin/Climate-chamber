import m from 'mithril'
import Chart from 'chart.js'
import G from './models/Graph'
import moment from 'moment'

const defaultLabels = Array(10).forEach((value,index) => value = index)
const intervals = [1, 5, 10, 30, 60, 300, 600, 3000, 6000]
const graphOpts = {}

const c = {
  oninit: _ => {
    G.getHistories()
  },
  view: _ => {
    return m('.graph__panel', [
      m('div.graph__form-container', [
        m('form#history-options', [
          m('select', { name: 'history', onchange: G.getHistoryById.bind(event) }, [
            m('option', 'Select an option'),
            G.histories.map(history =>
              m('option', {value: history._id}, `${history.program_id.name} - ${moment(history.createdAt).format('DD/MM/YYYY HH:mm:ss')}`))
          ])
        ]),
        G.filterable ? m('form#history-filter-options', [
          m('select', {name: 'interval', onchange: G.setInterval.bind(event)}, intervals.map(interval =>
            m('option', {value: interval, selected: G.filterOptions.interval == interval}, interval/60 >= 1 ? `${interval/60} minutes` : `${interval} seconds`)
          ))
        ]) : m('div')
      ]),
      m('div.graph__container', [
        m('canvas#js-graph.graph__chart')
      ])
    ])
  }
}

export default c
