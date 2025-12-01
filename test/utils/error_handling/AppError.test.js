import { describe, expect, it } from '@jest/globals'

describe('AppError', () => {
  it('should create error with 4xx status code', async () => {
    const AppError = (await import('../../../src/utils/error_handling/AppError.js')).default
    const error = new AppError('Bad request', 400)

    expect(error.message).toBe('Bad request')
    expect(error.statusCode).toBe(400)
    expect(error.status).toBe('fail')
    expect(error.isOperational).toBe(true)
  })

  it('should set status to error for 5xx status codes', async () => {
    const AppError = (await import('../../../src/utils/error_handling/AppError.js')).default
    const error = new AppError('Server error', 500)

    expect(error.status).toBe('error')
    expect(error.statusCode).toBe(500)
    expect(error.isOperational).toBe(true)
  })

  it('should default statusCode to 500', async () => {
    const AppError = (await import('../../../src/utils/error_handling/AppError.js')).default
    const error = new AppError('Default error')

    expect(error.statusCode).toBe(500)
    expect(error.status).toBe('error')
  })

  it('should capture stack trace', async () => {
    const AppError = (await import('../../../src/utils/error_handling/AppError.js')).default
    const error = new AppError('Test error', 400)

    expect(error.stack).toBeDefined()
    expect(error.stack).toContain('AppError')
  })
})
