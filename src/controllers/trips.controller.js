import { getAllTrips } from "../services/trips.service.js"

export const getTrips = async (req, res, next) => {
  try {
    const { origin, destination, sort_by } = req.query
    const data = await getAllTrips({ origin, destination, sort_by })

    return res.status(200).json({
      status: 'success',
      data
    })
  } catch (error) {
    next(error)
  }
}