import m from 'mithril'
import { setDigit, toTimer, stringValidate } from '../../global'
import { isEmpty } from 'lodash'
import { socket } from '../../global'

const regexes = {
  temperature: /^(\+|-|)\d{2,3}\.\d{2}/g,
  humidity: /\d{2,3}\.\d{1,2}/g
}
const model = {
  dryTemperature: '---.--',
  humidity: '---.--',
  timeLeft: '--:--:--',
  cycle: '-',
  step: '-',
  name: '----------',
  signals: {
    h1: false, h2: false, t1: false, t2: false,
    p3: false, p2: false, p1: false, lnv: false,
    c1: false, v4: false, fan: false, v1: false,
    v2c2: false, v3: false
  },

  fetch: _ => {
    socket.emit('req-display')
  }
}

socket.on('chamber-info', data => {
  model.dryTemperature = stringValidate(data[0], regexes.temperature)
  model.humidity = stringValidate(data[2], regexes.humidity)
  m.redraw()
})

socket.on('display', data => {
  if (!isEmpty(data)) {
    model.timeLeft = toTimer(data.timeleft)
    model.cycle = data.program.currentCycle
    model.step = data.program.currentStep
    model.name = data.program.name
    m.redraw()
  }
})

socket.on('reset-display', _ => {
  model.timeLeft = '--:--:--'
  model.cycle = '-'
  model.step = '-'
  model.name = '----------'
  m.redraw()
})

socket.on('command-params', data => {
  console.log(data)
  for (let signal in data) {
    model.signals[signal] = data[signal] == 1 ? true : false
  }
  m.redraw()
})

export default model
