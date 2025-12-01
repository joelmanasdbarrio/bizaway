import AppError from "../utils/error_handling/AppError.js"

/**
 * @typedef {Object} Trip
 * @property {string} origin
 * @property {string} destination
 * @property {number} cost
 * @property {number} duration
 * @property {string} type
 * @property {string} id
 * @property {string} display_name
 */

/**
 * @typedef {Object} GetTripsQuery
 * @property {string} origin - Origin airport code
 * @property {string} destination - Destination airport code
 * @property {'fastest'|'cheapest'} [sort_by] - Sort by fastest or cheapest trip
 */

/**
 * @param {GetTripsQuery} query Search query
 * @returns {Promise<Trip[]>}
 */
export const getAllTrips = async ({ destination, origin, sort_by = 'fastest'}) => {
  if(!destination)
    throw new AppError('\'destination\' query param is required', 400)
  if(!origin)
    throw new AppError('\'origin\' query param is required', 400)

  const params = new URLSearchParams({
    destination,
    origin
  })
  
  const res = await fetch(`${process.env.BASE_URL}/trips?${params}`, {
    method: 'GET',
    headers: { 'x-api-key': process.env.API_KEY }
  })
  
  if (!res.ok) {
    throw new Error(`Error fetching trips: ${res.status} ${res.statusText}`, res.status)
  }
  
  let trips = await res.json()

  if (sort_by === 'fastest') {
    trips = trips.sort((a, b) => a.duration - b.duration)
  } else if (sort_by === 'cheapest') {
    trips = trips.sort((a, b) => a.cost - b.cost)
  }

  return trips
}