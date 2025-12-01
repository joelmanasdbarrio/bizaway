import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals'

describe('Error Handler', () => {
  let consoleSpy
  let originalEnv

  beforeEach(() => {
    originalEnv = process.env.NODE_ENV
    consoleSpy = {
      log: jest.spyOn(console, 'log').mockImplementation(() => {}),
      error: jest.spyOn(console, 'error').mockImplementation(() => {}),
      warn: jest.spyOn(console, 'warn').mockImplementation(() => {}),
      debug: jest.spyOn(console, 'debug').mockImplementation(() => {})
    }
  })

  afterEach(() => {
    process.env.NODE_ENV = originalEnv
    Object.values(consoleSpy).forEach(spy => spy.mockRestore())
  })

  it('should call devError in development', async () => {
    process.env.NODE_ENV = 'development'
    const handler = (await import('../../../src/utils/error_handling/error_handler.js')).default

    const mockErr = {
      statusCode: 400,
      status: 'fail',
      message: 'Test error',
      stack: 'Error: test\nat file.js:1'
    }

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }

    handler(mockErr, null, mockRes, null)
    expect(mockRes.status).toHaveBeenCalledWith(400)
    expect(mockRes.json).toHaveBeenCalled()
  })

  it('should call prodError in production with operational error', async () => {
    process.env.NODE_ENV = 'production'
    const handler = (await import('../../../src/utils/error_handling/error_handler.js')).default

    const mockErr = {
      statusCode: 400,
      status: 'fail',
      message: 'Test error',
      isOperational: true,
      stack: 'Error: test\nat file.js:1'
    }

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }

    handler(mockErr, null, mockRes, null)
    expect(mockRes.status).toHaveBeenCalledWith(400)
  })

  it('should handle non-operational errors in production', async () => {
    process.env.NODE_ENV = 'production'
    const handler = (await import('../../../src/utils/error_handling/error_handler.js')).default

    const mockErr = {
      statusCode: 500,
      status: 'error',
      message: 'Unknown error',
      isOperational: false,
      stack: 'Error: test\nat file.js:1'
    }

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }

    handler(mockErr, null, mockRes, null)
    expect(mockRes.status).toHaveBeenCalledWith(500)
    const jsonCall = mockRes.json.mock.calls[0][0]
    expect(jsonCall.message).toBe('Something wrong happened')
  })

  it('should handle error without statusCode', async () => {
    process.env.NODE_ENV = 'production'
    const handler = (await import('../../../src/utils/error_handling/error_handler.js')).default

    const mockErr = {
      status: 'error',
      message: 'Test error',
      isOperational: true,
      stack: 'Error: test\nat file.js:1'
    }

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }

    handler(mockErr, null, mockRes, null)
    expect(mockRes.status).toHaveBeenCalledWith(500)
  })
})
