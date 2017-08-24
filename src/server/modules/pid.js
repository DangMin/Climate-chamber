function Pid (pid) {
  this.previousError = 0
  this.accumulator = 0

  this.ki = pid.integral
  this.kd = pid.derivative
  this.kp = pid.proportional
  this.dt = 1
  this.targetValue = null
  this.lastMeasure = null

  this.output = (measuredValue, dt) => {
    // console.log(`${this.targetValue} - ${measuredValue} - dt ${dt}`)
    let error = this.targetValue - measuredValue
    if (error > 190 || error < -190) {
      return 0
    }
    // console.log(`Error: ${this.error}`)
    this.accumulator += error * (dt/1000)

    let proportional = this.kp * error
    let integral     = this.ki * this.accumulator
    let derivative   = this.kd * ((error - this.previousError)/(dt/1000))
    // console.log(`PID: ${proportional} - ${integral} - ${derivative}`)

    let output = proportional + integral + derivative
    // console.log(`output: ${output}`)
    this.previousError = error

    return output < 0 ? 0 : output > 255 ? 255 : parseInt(output)
  }
}

module.exports = Pid
