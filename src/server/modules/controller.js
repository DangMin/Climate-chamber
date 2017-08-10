const { isEmpty } = require('lodash')
const emitter = require('../emitter')
const Pid = require('./pid')

const hour = 1000*60*60
const minute = 1000*60

function Controller() {
  this.program = {}
  this.steps = []

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

  this.init = (program, steps, tempPid, humidPid) => {
    if (isEmpty(this.program)) {
      console.log('assign')
      this.program = program
      if (!isEmpty(steps)) {
        this.steps = steps
        this.currentStep = isEmpty(steps) ? {} : this.steps[this.currentIndex]
        this.programStart = new Date()
        this.setTimeout()
      } else {
        emitter.emit('control', { signal: 'err', data: { msg: 'No step has been set.' } })
        this.reset()
      }
    } else {
      emitter.emit('control', { signal: 'err', data: { msg: 'Another program is running.' } })
    }
  }
  this.fetch = _ => {
    if (!isEmpty(this.program)) {
      console.log(this.currentStep)
      emitter.emit('control', { signal: 'display', data: {
        timeleft: this.timeLeft,
        program: {
          name: this.program.name,
          currentCycle: this.currentCycle,
          currentStep: this.currentStep.order
        }}})
    } else {
      emitter.emit('control', { signal: 'display', data: {}})
    }
  }

  this.setTimeout = _ => {
    let time = this.currentStep.time.split(':')
    let ms = parseInt(time[0])*hour + parseInt(time[1])*minute
    const timeStart = new Date()
    this.timeEnd = new Date(timeStart.getTime() + ms)
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
        emitter.emit('control', { signal: 'display', data: {
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
      this.setTimeout()
    } else if (this.currentCycle < this.program.cycles) {
      ++this.currentCycle
      console.log(`next cycle: ${this.currentCycle}`)
      this.currentIndex = 0
      this.currentStep = this.steps[this.currentIndex]
      this.setTimeout()
    } else {
      console.log('end program')
      emitter.emit('program-finish')
      this.programEnd = new Date()
      console.log(`${this.programEnd} - ${this.programStart}`)
      const total = this.programEnd.getTime() - this.programStart.getTime()
      console.log(`${parseInt(total/(60*60*1000))}:${parseInt(total/(60*1000))}:${parseInt(total%1000)}`)
      this.reset()
      emitter.emit('control', { signal: 'reset-display' })
    }
  }

  this.reset = _ => {
    this.program = {}
    this.steps = []

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
