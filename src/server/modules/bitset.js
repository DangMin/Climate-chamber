const { isNumber, isString } = require('lodash')

function Bitset (value = 0, bits = 8) {
  this.bits = transform(value, bits)

  this.set = function ( position, value ) {
    this.bits[this.bits.length-position-1] = value
  }
  this.toNumber = function () {
    return this.bits.reduce((acc, cur, index) => {
      if (cur === 1) {
        acc += Math.pow(2, this.bits.length-index-1)
      }
      return acc
    }, 0)
  }
  this.get = function (position) {
    return this.bits[this.bits.length-position-1]
  }
}

function transform (value, bits) {
  var rslt = Array(bits).fill(0)

  var v
  if (isNumber(value)) {
    v = value.toString().charCodeAt(0)
  } else if (isString(value)) {
    v = value.charCodeAt(0)
  }

  while(v >= 0 && --bits >= 0) {
    if (v - Math.pow(2,bits) >= 0) {
      rslt[rslt.length -bits-1] = 1
      v -= Math.pow(2,bits)
    }
  }

  return rslt
}

module.exports = Bitset
