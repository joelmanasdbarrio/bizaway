import express, { json } from 'express'
import tripsRouter from './routers/trips.router.js'
import globalErrorHandler from './utils/error_handling/error_handler.js'

const app = express()
app.use(json()) // Parse request/response into JSON objects

app.use('/api/v1/trips', tripsRouter)

app.use(globalErrorHandler) // Global error handler middleware
app.all(/.*/, (req, res) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server`
  })
})

export default app