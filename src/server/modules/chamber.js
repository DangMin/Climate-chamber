module.exports = {
  dryTemperature: null,
  wetTemperature: null,
  humidity: null,
  setValue: (dry, wet, humid) => {
    this.dryTemperature = dry
    this.wetTemperature = wet
    this.humidity = humid
  }
}
