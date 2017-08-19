function Pid (pid) {
  this.error = 0
  this.previousError = 0
  this.accumulator = 0

  this.integral = 0
  this.proportional = 0
  this.derivative = 0

  this.ki = pid.integral
  this.kd = pid.derivative
  this.kp = pid.proportional
  this.dt = 1
  this.targetValue = null

  this.output = measuredValue => {
    console.log(`${this.targetValue} - ${measuredValue}`)
    this.error = this.targetValue - measuredValue
    if (this.error > 190 || this.error < -190) {
      return 0
    }
    console.log(`Error: ${this.error}`)
    this.accumulator += this.error

    this.proportional = this.kp * this.error
    this.integral     = this.ki * this.accumulator
    this.derivative   = this.kd * (this.previousError - this.error)
    console.log(`PID: ${this.proportional} - ${this.integral} - ${this.derivative}`)

    let output = this.proportional + this.integral + this.derivative
    console.log(`output: ${output}`)
    this.previousError = this.error

    return output < 0 ? 0 : (output > 255 ? 255 : parseInt(output))
  }
}

module.exports = Pid
