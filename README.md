# Fresh Tracks server

This is the server for the Fresh Tracks ski logging app.  The client can be found [here]([https://github.com/mikirsch/ski-log-client](https://github.com/mikirsch/ski-log-client)).  Server is based on express and backing store is postgresql.

[Live client](https://ski-tracker.mikirsch.now.sh/)

## API
### POST /api/login
Accepts JSON with user_name and password, returns JWT on success.

### POST /api/signup
Accepts JSON with user_name and password, returns JWT on success.

### POST /api/logs
Requires authentication.
Required keys:
* date: string YYYY-MM-DD
* ski_area: string

Optional keys:
* duration: string hh:mm
* notes: string
* vert: integer

### GET /api/logs
Requires authentication.   By default returns all logs (as JSON) matching user making the request.  Query string can be used to filter by date (beginDate, optional endDate, YYYY-MM-DD)

## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests `npm test`