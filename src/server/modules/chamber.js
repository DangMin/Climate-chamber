function Chamber() {
  this.dryTemperature = null
  this.wetTemperature = null
  this.humidity = null

  this.setValue = (data) => {
    this.dryTemperature = data[0]
    this.wetTemperature = data[1]
    this.humidity = data[2]
  }
}

module.exports = Chamber
