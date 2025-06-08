📂 Exercise-Tracker/README.md
🏋️‍♂️ Exercise Tracker API
Track fitness activities with this MongoDB-powered service. Create users, log workouts, and analyze exercise patterns.

✨ Features
User profile creation

Exercise logging with dates

Activity report generation

Flexible date filtering

🔑 API Endpoints
Endpoint	Method	Description
/api/users	POST	Create new user
/api/users	GET	List all users
/api/users/:_id/exercises	POST	Add exercise
/api/users/:_id/logs?[from]&[to]&[limit]	GET	Get exercise logs
💾 Data Formats
Create User:

json
{"username": "fit_guru"}
Add Exercise:

json
{
  "description": "Morning Run",
  "duration": 30,
  "date": "2023-08-15"
}
💡 Try: POST /api/users/abc123/exercises with workout details!
