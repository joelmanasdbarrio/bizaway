import { describe, expect, it, jest } from '@jest/globals'
import express from 'express'
import request from 'supertest'
import mockTrips from '../../mock-response.json' with { type: 'json' }

// Create mock function
const mockGetAllTrips = jest.fn()

// Mock the module before importing
jest.unstable_mockModule('../../../src/services/trips.service.js', () => ({
  getAllTrips: mockGetAllTrips
}))

// Dynamic imports after mocking
const { getTrips } = await import('../../../src/controllers/trips.controller.js')
const tripsRouter = (await import('../../../src/routers/trips.router.js')).default

describe('Trips Router', () => {
  let app

  beforeEach(() => {
    app = express()
    app.use(express.json())
    app.use('/trips', tripsRouter)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /trips', () => {
    it('should return 200 with trips data on successful request', async () => {
      mockGetAllTrips.mockResolvedValue(mockTrips)

      const response = await request(app)
        .get('/trips')
        .query({ origin: 'BCN', destination: 'VIE' })

      expect(response.status).toBe(200)
      expect(response.body).toEqual({
        status: 'success',
        data: mockTrips
      })
      expect(mockGetAllTrips).toHaveBeenCalledWith({
        origin: 'BCN',
        destination: 'VIE',
        sort_by: undefined
      })
    })
  })
})
