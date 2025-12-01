import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals'
import AppError from '../../../src/utils/error_handling/AppError.js'
import mockTrips from '../../mock-response.json' with { type: 'json' }

// Create mock function
const mockGetAllTrips = jest.fn()

// Mock the module before importing
jest.unstable_mockModule('../../../src/services/trips.service.js', () => ({
  getAllTrips: mockGetAllTrips
}))

// Dynamic import after mocking
const { getTrips } = await import('../../../src/controllers/trips.controller.js')

describe('Trips Controller', () => {
  let req
  let res
  let next

  beforeEach(() => {
    req = {
      query: {}
    }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    }
    next = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('getTrips', () => {
    it('should return trips with status 200 when successful', async () => {
      req.query = { origin: 'BCN', destination: 'VIE' }
      mockGetAllTrips.mockResolvedValue(mockTrips)

      await getTrips(req, res, next)

      expect(mockGetAllTrips).toHaveBeenCalledWith({
        origin: 'BCN',
        destination: 'VIE',
        sort_by: undefined
      })
      expect(mockGetAllTrips).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: mockTrips
      })
      expect(next).not.toHaveBeenCalled()
    })

    it('should pass query parameters including sort_by to service', async () => {
      req.query = { origin: 'BCN', destination: 'VIE', sort_by: 'cheapest' }
      mockGetAllTrips.mockResolvedValue(mockTrips)

      await getTrips(req, res, next)

      expect(mockGetAllTrips).toHaveBeenCalledWith({
        origin: 'BCN',
        destination: 'VIE',
        sort_by: 'cheapest'
      })
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: mockTrips
      })
    })

    it('should call next with error when service throws AppError', async () => {
      const appError = new AppError('\'destination\' query param is required', 400)
      req.query = { origin: 'BCN' }
      mockGetAllTrips.mockRejectedValue(appError)

      await getTrips(req, res, next)

      expect(mockGetAllTrips).toHaveBeenCalledWith({
        origin: 'BCN',
        destination: undefined,
        sort_by: undefined
      })
      expect(next).toHaveBeenCalledWith(appError)
      expect(next).toHaveBeenCalledTimes(1)
      expect(res.status).not.toHaveBeenCalled()
      expect(res.json).not.toHaveBeenCalled()
    })

    it('should handle missing origin parameter', async () => {
      const appError = new AppError('\'origin\' query param is required', 400)
      req.query = { destination: 'VIE' }
      mockGetAllTrips.mockRejectedValue(appError)

      await getTrips(req, res, next)

      expect(next).toHaveBeenCalledWith(appError)
      expect(next).toHaveBeenCalledTimes(1)
    })

    it('should handle sort_by parameter set to fastest', async () => {
      req.query = { origin: 'BCN', destination: 'VIE', sort_by: 'fastest' }
      mockGetAllTrips.mockResolvedValue(mockTrips)

      await getTrips(req, res, next)

      expect(mockGetAllTrips).toHaveBeenCalledWith({
        origin: 'BCN',
        destination: 'VIE',
        sort_by: 'fastest'
      })
      expect(res.status).toHaveBeenCalledWith(200)
    })
  })
})
