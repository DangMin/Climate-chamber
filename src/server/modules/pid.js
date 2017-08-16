function Pid (pid) {
  this.error = 0
  this.previousError = 0

  this.integral = null
  this.proportional = null
  this.derivative = null

  this.ki = pid.integral
  this.kd = pid.derivative
  this.kp = pid.proportional
  this.dt = 1
  this.targetValue = null

  this.output = measuredValue => {
    this.error = this.targetValue - measuredValue
    if (this.error > 190 || this.error < -190) {
      return 0
    }

    this.integral = this.integral + (this.error * this.dt)
    this.derivative = (this.error - this.previousError) / this.dt
    this.proportional = this.kp * this.error

    this.previousError = this.error
    let output = this.proportional + (this.ki * this.integral) + (this.kd * this.derivative)

    return output < 0 ? 0 : (output > 255 ? 255 : output)
  }
}

module.exports = Pid
