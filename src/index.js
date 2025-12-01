import * as http from 'node:http'
import app from './app.js'
import logger from './utils/logger.js'

process.loadEnvFile() // Configure environment variables

// Control uncaught exceptions
process.on('uncaughtException', err => {
  logger.error(err.name, err.message)
  process.exit(1) // 0 Success, 1 Code exception
})

logger.info(`Starting app in ${process.env.NODE_ENV} mode...`)

const port = process.env.API_PORT || 8080
const server = http.createServer(app).listen(port, () => {
  logger.info(`Server running in port ${port}`)
})

// Control unhandled rejections
process.on('unhandledRejection', err => {
  logger.error(err.name, err.message)
  server.close(() => {
    process.exit(1) // 0 Success, 1 Code exception
  })
})
