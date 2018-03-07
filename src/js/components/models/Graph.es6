import m from 'mithril'
import chart from 'chart.js'
import Indicator from '../indicator'
import * as Error from '../indicators/errorIndicator'
import {isEmpty, assign, filter, keyBy, groupBy} from 'lodash'

const createChartData = data => {
  const chartData = {}
  chartData.labels = data.map(item => {
    return parseInt(item.overallSec/60)
  })

  chartData.datasets = [
    {
      label: 'Dry Temperature',
      borderColor: 'red',
      backgroundColor: 'red',
      fill: false,
      data: data.map(item => item.dryTemperature),
      yAxisID: 'temperature-axis'
    }, {
      label: 'Wet Temperature',
      borderColor: 'orange',
      backgroundColor: 'orange',
      fill: false,
      data: data.map(item => item.wetTemperature),
      yAxisID: 'temperature-axis'
    },{
      label: 'Humidity',
      borderColor: 'blue',
      backgroundColor: 'blue',
      fill: false,
      data: data.map(item => item.humidity),
      yAxisID: 'humidity-axis'
    }
  ]
  return chartData
}

const Graphs = {
  histories: [],
  dataset: [],
  infomation: {},
  filterOptions: {
    interval: 1,
    step: [],
    cycle: []
  },
  filterable: false,
  chartData: [],

  getHistories: _ => {
    m.request({
      method: 'GET', url: 'history'
    }).then(results => {
      if (!results.success)
        Indicator.setTitle('Error').setBody(Error.body(results.error)).show()
      else {
        Graphs.histories = results.histories
      }
    })
  },
  getHistoryById: event => {
    const id = event.currentTarget.value
    Graphs.filterable = true
    m.request({ method: 'GET', url: `/history/${id}`}).then(results => {
      if (results.contents) {
        Graphs.information = assign({ program_name: results.contents[0][0], operatedAt: results.contents[0][1] })
        Graphs.dataset = results.contents.slice(1, results.contents.length-1).map(data => {
          return !isEmpty(data) ? {
            cycle: data[0],
            step: data[1],
            overallSec: data[2],
            stepSec: data[3],
            dryTemperature: data[4],
            wetTemperature: data[5],
            humidity: data[6]
          } : null
        })
        Graphs.chartData = Graphs.dataset.filter((item, index) => item.overallSec%60 == 0 || index == 0 || index == Graphs.dataset.length-1)

        Graphs.drawGraph()
      }
    })
  },
  setInterval: (event) => {
    const interval = event.currentTarget.value
    Graphs.chartData = Graphs.dataset.filter((item, index) => item.overallSec%interval == 0 || index == 0 || index == Graphs.dataset.length)
    Graphs.drawGraph()
  },
  drawGraph: () => {
    const ctx = document.getElementById('js-graph').getContext('2d')
    const chartData = createChartData(Graphs.chartData)
    const chart = Chart.Line(ctx, {
      data: chartData,
      options: {
        stacked: false,
        scales: {
          yAxes: [
            { type: 'linear', display: true, 'position': 'left', id: 'temperature-axis' },
            { type: 'linear', display: true, 'position': 'right', id: 'humidity-axis', gridLines: {
                drawnOnChartArea: false
            }}
          ]
        },
        cubicInterpolationMode: 'monotone'
      }
    })
  }
}

module.exports = Graphs
