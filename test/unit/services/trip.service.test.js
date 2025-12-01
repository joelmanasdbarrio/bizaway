import { afterEach, describe, expect, it, jest } from '@jest/globals'
import { getAllTrips } from '../../../src/services/trips.service'
import AppError from "../../../src/utils/error_handling/AppError.js"
import mock_response from '../../mock-response.json' with { type: 'json' }

describe('Trip Service', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should fetch trips and sort by fastest by default', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mock_response)
      })
    )

    const result = await getAllTrips({ origin: 'BCN', destination: 'VIE' })
    expect(result).toBeDefined()
    expect(result.length).toBe(mock_response.length)
    expect(result[0].duration).toBeLessThanOrEqual(result[1].duration)
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it('should fetch trips and sort by fastest when specified', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mock_response)
      })
    )

    const result = await getAllTrips({ origin: 'BCN', destination: 'VIE', sort_by: 'fastest' })
    expect(result).toBeDefined()
    expect(result.length).toBe(mock_response.length)
    expect(result[0].duration).toBeLessThanOrEqual(result[1].duration)
    expect(result[1].duration).toBeLessThanOrEqual(result[2].duration)
    expect(result[2].duration).toBeLessThanOrEqual(result[3].duration)
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it('should fetch trips and sort by cheapest when specified', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mock_response)
      })
    )

    const result = await getAllTrips({ origin: 'BCN', destination: 'VIE', sort_by: 'cheapest' })
    expect(result).toBeDefined()
    expect(result.length).toBe(mock_response.length)
    expect(result[0].cost).toBeLessThanOrEqual(result[1].cost)
    expect(result[1].cost).toBeLessThanOrEqual(result[2].cost)
    expect(result[2].cost).toBeLessThanOrEqual(result[3].cost)
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it('should throw an error if origin or destination are missing', async () => {
    await expect(getAllTrips({ origin: 'BCN' })).rejects.toThrow(AppError)
    await expect(getAllTrips({ origin: 'BCN' })).rejects.toThrow('\'destination\' query param is required')
    await expect(getAllTrips({ destination: 'VIE' })).rejects.toThrow(AppError)
    await expect(getAllTrips({ destination: 'VIE' })).rejects.toThrow('\'origin\' query param is required')
  })

  it('should throw an error if the external API call fails', async () => {
    global.fetch = jest.fn(() =>
      Promise.reject(new Error('API Error'))
    )

    await expect(getAllTrips({ origin: 'BCN', destination: 'VIE' })).rejects.toThrow()
  })

  it('should return empty array if no trips are found', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([])
      })
    )

    const result = await getAllTrips({ origin: 'BCN', destination: 'VIE' })
    expect(result).toEqual([])
  })

  it('should throw an error if the external API returns a non-ok response', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      })
    )

    await expect(getAllTrips({ origin: 'BCN', destination: 'VIE' })).rejects.toThrow(Error)
    await expect(getAllTrips({ origin: 'BCN', destination: 'VIE' })).rejects.toThrow('Error fetching trips: 500 Internal Server Error')
  })
})