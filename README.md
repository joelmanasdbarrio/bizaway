This project allows users to search for trips between two locations, sorted by either the fastest or cheapest option.
It integrates with a third-party API to fetch trip data and provides an API endpoint for clients to access this information.

# Installation

Execute the following command to install all necessary dependencies:

```bash
npm ci            # For development environment
npm ci --omit=dev # For production environment
```

## Testing

Execute tests using the following command:

```bash
npm test
npm run test:coverage # To include coverage report
```

# Running the Application

To start the application, use the following command:

```bash
npm start         # For production environment
npm run start:dev # For development environment
```

# API Endpoint

The application exposes an API endpoint to search for trips:

```
GET /api/v1/trips
```

## Query Parameters

- `origin`: IATA 3 letter code of the origin (e.g., "SYD")
- `destination`: IATA 3 letter code of the destination (e.g., "GRU")
- `sort_by`: Sorting strategy, either `fastest` or `cheapest`

## Example Request

```
GET /api/v1/trips?origin=SYD&destination=GRU&sort_by=fastest
```

## Example Response

```json
[
  {
    "origin": "SYD",
    "destination": "GRU",
    "cost": 625,
    "duration": 5,
    "type": "flight",
    "id": "1",
    "display_name": "from SYD to GRU by flight"
  }
]
```

You can find a ready-to-use Postman collection for testing the API in the [postman](./postman/trips.postman_collection.json) folder.