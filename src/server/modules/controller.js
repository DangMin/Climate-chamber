const { isEmpty } = require('lodash')
const emitter = require('../emitter')
const Pid = require('./pid')

const hour = 1000*60*60
const minute = 1000*60

function Controller() {
  this.program = {}
  this.steps = []

  this.running = false

  this.currentIndex = 0
  this.currentCycle = 1
  this.currentStep = {}

  this.tempPid = {}
  this.humidPid = {}

  this.currentTimeout = null
  this.currentInterval = null

  this.timeEnd = 0
  this.timeLeft = null
  this.programStart = null
  this.programEnd = null

  this.temperaturePid = null
  this.humidityPid = null

  this.init = (program, steps, pids) => {
    if (isEmpty(this.program)) {
      this.program = program
      if (!isEmpty(steps)) {
        this.steps = steps
        this.currentStep = isEmpty(steps) ? {} : this.steps[this.currentIndex]
        this.programStart = new Date()
        this.temperaturePid = new Pid(pids.temperature)
        this.humidityPid = new Pid(pids.humidity)
        this.setup()
      } else {
        emitter.emit('control-error', { signal: 'err', data: { msg: 'No step has been set.' } })
        this.reset()
      }
    } else {
      emitter.emit('control-error', { signal: 'err', data: { msg: this.program && this.program._id == program._id ? 'This program is already started' : 'Another program is running.' } })
    }
  }

  this.fetch = _ => {
    if (!isEmpty(this.program)) {
      console.log(this.currentStep)
      emitter.emit('control-error', { signal: 'display', data: {
        timeleft: this.timeLeft,
        program: {
          name: this.program.name,
          currentCycle: this.currentCycle,
          currentStep: this.currentStep.order
        }}})
    } else {
      emitter.emit('control-error', { signal: 'display', data: {}})
    }
  }

  this.setup = _ => {
    let time = this.currentStep.time.split(':')
    let ms = parseInt(time[0])*hour + parseInt(time[1])*minute
    const timeStart = new Date()
    this.running = true
    this.timeEnd = new Date(timeStart.getTime() + ms)
    this.temperaturePid.targetValue = this.currentStep.temperature
    this.humidityPid.targetValue = this.currentStep.humidity
    console.log(`temperature target value: ${this.temperaturePid.targetValue}`)
    //this.currentTimeout = setTimeout(this.switchStep, ms)
    this.setInterval()
    // this.currentInterval = setInterval(this.control, 1000)
  }

  this.setInterval = _ => {
    this.currentInterval = setInterval(_ => {
      if (this.timeLeft <= 0 && this.timeLeft) {
        clearInterval(this.currentInterval)
        this.switchStep()
        this.timeLeft = null
      } else {
        this.timeLeft = (this.timeEnd.getTime() - new Date().getTime())/1000
        // console.log(this.timeLeft)
        // console.log(`Time left: ${parseInt(this.timeLeft/3600)}:${parseInt(this.timeLeft/60)}:${parseInt(this.timeLeft%60)}`)
        emitter.emit('control-error', { signal: 'display', data: {
          timeleft: this.timeLeft,
          program: {
            name: this.program.name,
            currentCycle: this.currentCycle,
            currentStep: this.currentStep.order
          } } })
      }
    }, 1000)
  }

  this.switchStep = _ => {
    console.log('enter switch step')
    if (this.steps[this.currentIndex+1]) {
      ++this.currentIndex
      console.log(`next step: ${this.currentIndex}`)
      this.currentStep = this.steps[this.currentIndex]
      this.setup()
    } else if (this.currentCycle < this.program.cycles) {
      ++this.currentCycle
      console.log(`next cycle: ${this.currentCycle}`)
      this.currentIndex = 0
      this.currentStep = this.steps[this.currentIndex]
      this.setup()
    } else {
      console.log('end program')
      emitter.emit('program', { signal: 'program', data: { message: 'Program is finish.' }})
      this.programEnd = new Date()
      const total = this.programEnd.getTime() - this.programStart.getTime()
      this.reset()
      emitter.emit('control-error', { signal: 'reset-display' })
    }
  }

  this.reset = _ => {
    this.program = {}
    this.steps = []

    this.running = false

    this.currentIndex = 0
    this.currentCycle = 1
    this.currentStep = {}

    this.tempPid = {}
    this.humidPid = {}

    if (this.currentTimeout) {
      clearTimeout(this.currentTimeout)
    }

    if (this.currentInterval) {
      clearTimeout(this.currentInterval)
    }
  }
}

module.exports = Controller
