import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals'

describe('Logger', () => {
  let consoleSpy

  beforeEach(() => {
    consoleSpy = {
      log: jest.spyOn(console, 'log').mockImplementation(() => {}),
      error: jest.spyOn(console, 'error').mockImplementation(() => {}),
      warn: jest.spyOn(console, 'warn').mockImplementation(() => {}),
      debug: jest.spyOn(console, 'debug').mockImplementation(() => {})
    }
  })

  afterEach(() => {
    Object.values(consoleSpy).forEach(spy => spy.mockRestore())
  })

  it('should log info messages', async () => {
    const logger = (await import('../../src/utils/logger.js')).default
    logger.info('test message')
    expect(consoleSpy.log).toHaveBeenCalled()
  })

  it('should log error messages', async () => {
    const logger = (await import('../../src/utils/logger.js')).default
    logger.error('error message')
    expect(consoleSpy.error).toHaveBeenCalled()
  })

  it('should log warn messages', async () => {
    const logger = (await import('../../src/utils/logger.js')).default
    logger.warn('warn message')
    expect(consoleSpy.warn).toHaveBeenCalled()
  })

  it('should log debug messages', async () => {
    const logger = (await import('../../src/utils/logger.js')).default
    logger.debug('debug message')
    expect(consoleSpy.debug).toHaveBeenCalled()
  })

  it('should normalize null values', async () => {
    const logger = (await import('../../src/utils/logger.js')).default
    logger.info(null)
    const calls = consoleSpy.log.mock.calls[0][0]
    expect(calls).toContain('null')
  })

  it('should normalize undefined values', async () => {
    const logger = (await import('../../src/utils/logger.js')).default
    logger.info(undefined)
    const calls = consoleSpy.log.mock.calls[0][0]
    expect(calls).toContain('undefined')
  })

  it('should normalize objects to JSON', async () => {
    const logger = (await import('../../src/utils/logger.js')).default
    logger.info({ key: 'value' })
    const calls = consoleSpy.log.mock.calls[0][0]
    expect(calls).toContain('key')
  })

  it('should handle array of messages', async () => {
    const logger = (await import('../../src/utils/logger.js')).default
    logger.info(['msg1', 'msg2'])
    expect(consoleSpy.log).toHaveBeenCalled()
  })

  it('should handle string that cannot stringify', async () => {
    const logger = (await import('../../src/utils/logger.js')).default
    const circular = {}
    circular.self = circular
    logger.info(circular)
    expect(consoleSpy.log).toHaveBeenCalled()
  })
})
