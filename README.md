# Fresh Tracks server

This is the server for the Fresh Tracks ski logging app.  The client can be found [here]([https://github.com/mikirsch/ski-log-client](https://github.com/mikirsch/ski-log-client)).  Server is based on express and backing store is postgresql.

[Live client](https://ski-tracker.mikirsch.now.sh/)
## Summary 
This app is designed to allow users to easily track their winter sports activity.  There is a simple interface to record a day, which can be as minimal as a date and the name of the ski area.  If desired, the actual time spent and vertical gained can be logged, and freeform notes can be added.  There is a tool to help calculate vertical gained over the course of a day.  The user can go back to view their activity over time, including individual logs or aggregated statistics.

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

## Tech stack
Client is done in React and deployed on Zeit. Server is Express on NodeJS with PostgreSQL for persistence, deployed on Heroku.
