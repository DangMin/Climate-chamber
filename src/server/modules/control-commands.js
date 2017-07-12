const { checkSum, toBitsArray, fillUnicodeValue } = require('../helpers')

const SIGNAL = {
  stx: 0x02,
  ext: 0x03,
  zero: 0x30,
  capO: 0x4F,
  question: 0x3F,
  linebreak: 0x0D,
  iy: { i: 0x49, y: 0x79 },
  aq: { a: 0x41, q: 0x71 },
  br: { b: 0x42, r: 0x72 }
}

const HEADER = [ SIGNAL.stx, SIGNAL.zero ]
const FOOTER = [ SIGNAL.linebreak ]
const IY_MSG = [ SIGNAL.iy.i, SIGNAL.ext, SIGNAL.iy.y ]
const AQ_MSG = [ SIGNAL.aq.a, SIGNAL.ext, SIGNAL.aq.q ]
const BR_MSG = [ SIGNAL.br.b, SIGNAL.ext, SIGNAL.br.r ]

function ControlCommands () {
  this.ready = false

  this.htBlock = 0 // Equal to 0
  this.plBlock = 0
  this.cvBlock = 0
  this.vfBlock = 0
  this.humidPR1 = 0
  this.humidPR2 = 0
  this.tempPR1 = 0
  this.tempPR2 = 0
  this.tempPower
  this.humidPower

  this.createCmd = {
    iy: () => Buffer.from(HEADER.concat(IY_MSG, FOOTER)),
    aq: () => Buffer.from(HEADER.concat(AQ_MSG, FOOTER)),
    br: () => Buffer.from(HEADER.concat(BR_MSG, FOOTER)),
    o: () => {
      let header = HEADER.concat(SIGNAL.capO, Array(12).fill(SIGNAL.zero))
      let body = [].concat(fillUnicodeValue(this.htBlock, this.plBlock, this.cvBlock, this.vfBlock, this.humidPR1, this.humidPR2, this.tempPR1, this.tempPR2), SIGNAL.ext)
      let msg = header.concat(body)
      let cks = checkSum(msg)
      return Buffer.from(msg.concat(cks, FOOTER))
    },
    idle: () => Buffer.from(header.concat(SIGNAL.capO, Array(20).fill(SIGNAL.zero), SIGNAL.ext, SIGNAL.question, SIGNAL.linebreak))
  }

  this.read = (data) => {
    let info = []
    data.slice(3, data.length - 1).forEach(curr => {
      info.push(String.fromCharCode(curr))
    })
    return info.join('').split(' ')
  }

  this.switchValves = (value) => {}
  this.switchHeaters = (value) => {}
  this.switchCoolers = (value) => {}
  this.switchHumidifier = (value) => {}

  this.onTempPwChanged = (value) => {
    let bits = toBitsArray(value)
    this.setTempPR(1, bits.slice(0, 4))
    this.setTempPR(2, bits.slice(4))
  }
  this.onHumidPWChanged = (value) => {
    let bits = toBitsArray(value)
    this.setHumidPR(1, bits.slice(0, 4))
    this.setHumidPR(2, bits.slice(4))
  }

  this.setTempPR = (tempID, value) => {
    let bits = Array(4).fill(0)
    this['tempPR' + tempID] = bits.concat(value)
  }
  this.setHumidPR = (humidID, value) => {
    let bits = Array(4).fill(0)
    this['humidPR' + humidID] = bits.concat(value)
  }

  this.setReady = () => {
    if (!this.ready) {
      this.ready = true
    }
  }
  this.unsetReady = () => {
    if (this.ready) {
      this.ready = false
    }
  }
}

module.exports = ControlCommands
