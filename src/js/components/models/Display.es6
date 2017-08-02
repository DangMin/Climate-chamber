import m from 'mithril'
import io from 'socket.io-client'

const socket = io('http://localhost:8080')

const model = {
  dryTemperature: '---.--',
  humidity: '---.--',
}

socket.on('chamber-info', data => {
  model.dryTemperature = data[0]
  model.humidity = data[2]
  m.redraw()
})

export default model
