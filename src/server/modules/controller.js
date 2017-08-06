const { isEmpty } = require('lodash')

function Controller() {
  this.program = {}
  this.steps = []
  this.currentStep = {}
  this.nextStep = {}
  this.tempPid = {}
  this.humidPid = {}

  this.init = (program, steps) => {
    this.program = program
    this.steps = steps
    this.currentStep = isEmpty(steps) ? {} : steps[0]
  }
}

module.exports = Controller
