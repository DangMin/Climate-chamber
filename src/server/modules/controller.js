const Pid = require('./pid')
const emitter = require('../emitter')
const { isEmpty } = require('lodash')

const HOUR = 1000*60*60
const MINUTE = 1000*60

function Controller (chamber, command) {
  this.chamber = chamber    // Chamber information
  this.command = command    // Command

  this.stepNumber = 0             // Step number
  this.cycleNumber = 1            // Cycle number

  this.program = null
  this.steps = null

  this.pids = {
    temperature: null,
    humidity: null
  }

  this.current = {
    step: null,
  }

  this.time = {
    start: null,
    end: null,
    lastMeasure: null
  }

  this.initiate = (program, steps, pids) => {
    console.log('-- Initiating --')
    if (!isEmpty(this.program)) {
      // If there is a running program, emit error message
      emitControl('err', { message: this.program && this.program._id == program._id ? ' This program is running.' : 'There is another program running.' })
    } else {
      if (isEmpty(steps)) {
        emitControl('err', { message: 'The program has no step.' })
      } else {
        this.program = program
        this.steps = steps
        this.current.step = this.steps[this.stepNumber]
        this.current.cycle =
        this.pids.temperature = new Pid(pids.temperature, this.current.step.temperature)
        this.pids.humidity = new Pid(pids.humidity, this.current.step.humidity)

        this.setup()
      }
    }
  }

  this.setup = _ => {
    console.log('-- Setting up --')
    let time = this.current.step.time.split(':')
    let ms = parseInt(time[0]*HOUR + time[1]*MINUTE)

    this.time.start = new Date()
    this.time.end = this.time.start + ms
    this.command.idle = false

    this.start()
  }

  this.start = _ => {
    console.log('-- Start program --')
    this.interval = setInterval(_ => {
      const timeLeft = (this.time.end - new Date().getTime())/1000
      if (timeLeft <= 0) {
        clearInterval(this.interval)
        this.switchStep()
      } else {
        this.prepareControl()
        emitControl('display', {
          timeleft: 0,  // fix
          program: {
            name: this.program.name,
            currentCycle: this.cycleNumber,
            currentStep: this.stepNumber
          }
        })
      }
    }, 1000)
  }

  this.switchStep = _ => {
    if (this.steps[this.stepNumber+1]) {
      console.log('-- Switching step --')
      this.command.idle = true
      this.step += 1
      this.current.step = this.steps[this.stepNumber]
      this.setup()
    } else if (this.cycleNumber < this.program.cycles) {
      console.log('-- Switching cycle --')
      this.command.idle = true
      this.cycleNumber += 1
      this.stepNumber = 0
      this.current.step = this.steps[this.stepNumber]
      this.setup()
    } else {
      console.log('-- End program --')
      emitControl('program', { message: 'Program is finish.' })
      this.command.idle = true
      this.reset()
    }
  }

  this.prepareControl = _ => {
    const on = 1, off = 0
    const { dryTemperature, wetTemperature, humidity } = this.chamber
    let dt = 0

    if (this.time.lastMeasure) {
      this.time.lastMeasure = new Date()
      dt = this.time.lastMeasure - this.time.start
    } else {
      let t = new Date()
      dt = t - this.time.lastMeasure
      this.time.lastMeasure = t
    }

    this.command.temperaturePower = this.pids.temperature.output(dryTemperature, dt)
    this.command.humidityPower = this.pids.humidity.output(humidity, dt)

    if (this.command.temperaturePower <= 0) {
      this.command.cvBlock.set(1, on)
      this.command.vfBlock.set(1, on)
      this.command.switchHeaters(off)
    } else {
      this.command.switchHeaters(on)
      this.command.switchCoolers(off)
    }

    if (this.command.humidityPower <= 0) {
      this.command.switchHumidifiers(off)
    } else {
      this.command.switchHumidifiers(on)
    }
  }

  this.reset = _ => {
    this.program = null
    this.steps = null
    this.stepNumber = 0
    this.cycleNumber = 1

    this.current.step = null
    this.time.start = null
    this.time.end = null
    this.time.lastMeasure = null

    this.pids.temperature = null
    this.pids.humidity = null

    if (this.interval) {
      clearInterval(this.interval)
    }
  }

  this.fetch = _ => {
    if (!isEmpty(this.program)) {
      emitControl('display', {
        program: {
          name: this.program.name,
          currentCycle: this.currentCycle,
          currentStep: this.currentStep.order
        }
      })
    } else {
      emitControl('display', {})
    }
  }
}

module.exports = Controller

const emitControl = (signal, data) => {
  emitter.emit('control', {
    signal: signal, data: data
  })
}
