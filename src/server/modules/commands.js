const { checkSum, toBitsArray, fillUnicodeValue, obj2array, bit2value } = require('../helpers')
const Bitset = require('./bitset')

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

function Command () {
  this.ready = false
  this.idle = true
  this.isConnected = false

  this.htBlock = new Bitset(0)
  this.plBlock = new Bitset(0)
  this.cvBlock = new Bitset(0)
  this.vfBlock = new Bitset(0)
  this.tempPw1 = new Bitset(0)
  this.tempPw2 = new Bitset(0)
  this.humidPw1 = new Bitset(0)
  this.humidPw2 = new Bitset(0)

  this.temperaturePower = 0
  this.humidityPower = 0

  this.temperatureBlocks = function() {
    var base = new Bitset(this.temperaturePower)
    this.tempPw1.set(3, base.get(7))
    this.tempPw1.set(2, base.get(6))
    this.tempPw1.set(1, base.get(5))
    this.tempPw1.set(0, base.get(4))

    this.tempPw2.set(3, base.get(3))
    this.tempPw2.set(2, base.get(2))
    this.tempPw2.set(1, base.get(1))
    this.tempPw2.set(0, base.get(0))
  }

  this.humidityBlocks = function() {
    var base = new Bitset(this.humidityPower)
    this.humidPw1.set(3, base.get(7))
    this.humidPw1.set(2, base.get(6))
    this.humidPw1.set(1, base.get(5))
    this.humidPw1.set(0, base.get(4))

    this.humidPw2.set(3, base.get(3))
    this.humidPw2.set(2, base.get(2))
    this.humidPw2.set(1, base.get(1))
    this.humidPw2.set(0, base.get(0))
  }

  this.output = _ => {
    return {
      h1: this.htBlock.get(2),
      h2: this.htBlock.get(3),
      t1: this.htBlock.get(0),
      t2: this.htBlock.get(1),
      p3: this.plBlock.get(3),
      p2: this.plBlock.get(2),
      p1: this.plBlock.get(1),
      lnv: this.plBlock.get(0),
      c1: this.cvBlock.get(1),
      v4: this.cvBlock.get(0),
      fan: this.vfBlock.get(0),
      v1: this.vfBlock.get(1),
      v2c2: this.vfBlock.get(2),
      v3: this.vfBlock.get(3),
      temperaturePower: this.temperaturePower,
      humidityPower: this.humidityPower
    }
  }

  this.command = {
    iy: _ => Buffer.from(HEADER.concat(IY_MSG, FOOTER)),
    aq: () => Buffer.from(HEADER.concat(AQ_MSG, FOOTER)),
    br: () => Buffer.from(HEADER.concat(BR_MSG, FOOTER)),
    idle: () => Buffer.from(HEADER.concat(SIGNAL.capO, Array(20).fill(SIGNAL.zero), SIGNAL.ext, SIGNAL.question, SIGNAL.linebreak)),
    o: _ => {
      this.humidityBlocks()
      this.temperatureBlocks()
      let header = HEADER.concat(SIGNAL.capO, Array(12).fill(SIGNAL.zero))
      let body = []
      let base = [this.htBlock, this.plBlock, this.cvBlock, this.vfBlock, this.humidPw1, this.humidPw2, this.tempPw1, this.tempPw2].forEach(param => {
        body.push(param.toNumber())
      })
      let msg = header.concat(body)
      let cks = checkSum(msg)
      return Buffer.from(msg.concat(cks, FOOTER))
    }
  }

  this.read = (data) => {
    let info = []
    data.slice(3, data.length - 1).forEach(curr => {
      info.push(String.fromCharCode(curr))
    })
    return info.join('').split(' ')
  }

  this.switchValves = value => {
    this.vfBlock.set(1, value)
    this.vfBlock.set(2, value)
    this.vfBlock.set(3, value)
    this.cvBlock.set(0, value)
  }

  this.switchHeaters = value => {
    this.htBlock.set(0, value)
    this.htBlock.set(1, value)
  }
  this.switchCoolers = value => {
    this.cvBlock.set(1, value)
    this.vfBlock.set(2, value)
  }
  this.switchHumidifiers = value => {
    this.htBlock.set(0, value)
    this.htBlock.set(1, value)
  }
  this.setReady = (value) => {
    this.ready = this.ready == value ? this.ready : value
  }

  this.resetParams = _ => {
    this.idle = true
    this.humidityPower = 0
    this.temperaturePower = 0
    this.switchCoolers(false)
    this.switchHeaters(false)
    this.switchHumidifiers(false)
    this.switchValves(false)
  }
}

module.exports = Command
