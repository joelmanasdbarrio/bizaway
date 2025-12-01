import express from 'express'
import { getTrips } from '../controllers/trips.controller.js'

const tripsRouter = express.Router()
tripsRouter.route('/')
 .get(getTrips)

export default tripsRouter