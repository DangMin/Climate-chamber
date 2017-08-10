const { checkSum, toBitsArray, fillUnicodeValue, obj2array, bit2value } = require('../helpers')

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

  this.htBlock = {
    h1: 0, h2: 0, t2: 0, t1: 0
  } // Equal to 0
  this.plBlock = {
    p3: 0, p2: 0, p1: 0, lnv: 0
  }
  this.cvBlock = {
    e0: 0, e1: 0, c1: 0, v4: 0
  }
  this.vfBlock = {
    v3: 0, v2c2: 0, v1: 0, fn1: 0
  }
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
      let body = [].concat(fillUnicodeValue(bit2value(obj2array(this.htBlock)), bit2value(obj2array(this.plBlock)), bit2value(obj2array(this.cvBlock)), bit2value(obj2array(this.vfBlock)), this.humidPR1, this.humidPR2, this.tempPR1, this.tempPR2), SIGNAL.ext)
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

  this.switchValves = (value) => {
    this.vfBlock.v1 = value
    this.vfBlock.v3 = value
    this.vfBlock.v4 = value
    this.vfBlock.v2c2 = value
  }
  this.switchHeaters = (value) => {
    this.htBlock.t1 = value
    this.htBlock.t2 = value
  }
  this.switchCoolers = (value) => {
    this.cvBlock.c1 = value
    this.vfBlock.v2c2 = value
  }
  this.switchHumidifier = (value) => {
    this.htBlock.h1 = value
    this.htBlock.h2 = value
  }

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
  this.setParams = (block, subblock, value) => {
    this[block][subblock] = value
  }

  this.onParamsChanged = (main, sub, value) => {
    if (!sub) {
      this[main] = value
    } else {
      this[main][sub] = value
    }
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

  this.resetParams = _ => {
    this.idle = true
    this.humidityPower = 0
    this.temperaturePower = 0
    this.switchCoolers(false)
    this.switchHeaters(false)
    this.switchHumidifier(false)
    this.switchValves(false)
  }
}

module.exports = ControlCommands
