export default class AppError extends Error {
  /**
   * @param message Error message
   * @param statusCode HTTP status code
   */
  constructor (message, statusCode = 500) {
    super(message)
    this.statusCode = statusCode
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'
    this.isOperational = true
    Error.captureStackTrace(this, this.constructor)
  }
}
