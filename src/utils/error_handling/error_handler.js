import logger from '../logger.js'

/**
 * Log and return the complete error message in development mode to trace and debug the error
 * @param {Error} err Error object
 * @param {Response} res Response
 */
const devError = (err, res) => {
  logger.error(err)

  const error = {
    status: err.status,
    message: err.message,
    stack: err.stack.split('\n')
  }
  logger.debug(error)

  res.status(err.statusCode).json(error)
}

/**
 * Log and return a generic error message in production mode to leak as less info as possible
 * @param {Error} err Error object
 * @param {Response} res Response
 */
const prodError = (err, res) => {
  logger.error(err)

  const error = {
    status: err.status,
    message: err.message,
    stack: err.stack.split('\n')
  }
  logger.debug(error)

  if (err.isOperational) { // Trusted, operational errors we can throw
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    })
  } else { // Untrusted, unknown errors from the app
    res.status(500).json({
      status: 'error',
      message: 'Something wrong happened',
    })
  }
}

/**
 * Global error handler middleware
 * @param {Error} err Error object
 * @param {Request} req Request
 * @param {Response} res Response
 * @param {NextFunction} next Next function
 */
export default function globalErrorHandler (err, req, res, next) {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'
  if (process.env.NODE_ENV === 'development') {
    devError(err, res)
  } else if (process.env.NODE_ENV === 'production') {
    prodError(err, res)
  }
}
