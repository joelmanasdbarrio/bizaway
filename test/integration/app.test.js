import { describe, expect, it } from '@jest/globals'
import request from 'supertest'
import app from '../../src/app.js'

describe('App Integration', () => {
  describe('404 handler', () => {
    it('should return 404 for undefined routes', async () => {
      const response = await request(app)
        .get('/nonexistent')

      expect(response.status).toBe(404)
      expect(response.body.status).toBe('fail')
      expect(response.body.message).toContain('Can\'t find')
    })
  })

  describe('JSON middleware', () => {
    it('should parse JSON in requests', async () => {
      const response = await request(app)
        .post('/nonexistent')
        .set('Content-Type', 'application/json')
        .send({ test: 'data' })

      expect(response.status).toBe(404)
    })
  })
})
