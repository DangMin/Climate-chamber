import m from 'mithril'
import io from 'socket.io-client'
import { setDigit, toTimer } from '../../global'
import { isEmpty } from 'lodash'

const socket = io('http://localhost:8080')

const model = {
  dryTemperature: '---.--',
  humidity: '---.--',
  timeLeft: '--:--:--',
  cycle: '-',
  step: '-',
  name: '----------',

  fetch: _ => {
    socket.emit('req-display')
  }
}

socket.on('chamber-info', data => {
  model.dryTemperature = data[0]
  model.humidity = data[2]
  m.redraw()
})

socket.on('display', data => {
  console.log(data)
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

export default model
