# FLEXION — API Documentation (Developer Guide)

Base URL: `https://sublime-grad-interventions-malpractice.trycloudflare.com/`
Auth: `Authorization: Bearer <JWT>` (get token from `/api/register` or `/api/login`)

## Auth

| Method | Endpoint | Body | Returns |
| --- | --- | --- | --- |
| POST | `/api/register` | {name, username, email, password} | 201 `{token, user}` |
| POST | `/api/login` | {username, password} | 200 `{token, user}` |

## Users

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/users/me` | full profile (incl. settings) |
| PUT | `/api/users/me` | update name/username/email/bio/settings (nested merge) |
| POST | `/api/users/me/picture` | multipart `picture` image upload (max 5MB) |
| GET | `/api/users/me/export` | GDPR full data dump (JSON) |
| DELETE | `/api/users/me` | GDPR erasure: account + all data + photos |
| GET | `/api/users/search?q=` | public user search (name/username) |

## Workouts

| Method | Endpoint | Notes |
| --- | --- | --- |
| GET | `/api/workouts` | `?category=&tag=&search=&page=&limit=` (paginated shape when `page` set) |
| POST | `/api/workouts` | {name, category, tags[], date, notes, exercises[{name,sets,reps,weight,notes}]} |
| PUT | `/api/workouts/:id` | owner-only |
| DELETE | `/api/workouts/:id` | owner-only |

## Nutrition

| Method | Endpoint | Notes |
| --- | --- | --- |
| GET | `/api/nutrition` | `?date=YYYY-MM-DD&mealType=&page=&limit=` |
| GET | `/api/nutrition/summary?date=` | daily macro totals |
| GET | `/api/nutrition/weekly?date=` | last-7-days calories per day |
| POST | `/api/nutrition` | {mealType, date, items[{name,quantity,calories,protein,carbs,fat}]} |
| PUT / DELETE | `/api/nutrition/:id` | owner-only |

## Progress

| Method | Endpoint | Notes |
| --- | --- | --- |
| GET | `/api/progress` | all entries, oldest first (chart-ready) |
| POST | `/api/progress` | {date, weight, chest, waist, hips, arm, runTime, liftWeight, notes} |
| DELETE | `/api/progress/:id` | owner-only |

## Feedback

| Method | Endpoint | Notes |
| --- | --- | --- |
| POST | `/api/feedback` | {type: support\\|bug\\|feedback, subject, message} |
| GET | `/api/feedback/mine` | my submissions + status |

## System

| Method | Endpoint | Notes |
| --- | --- | --- |
| GET | `/health` | uptime/status |
| GET | `/api/metrics` | request counts, error count, avg response ms, memory |

## Data Models

- **User**: name, username (unique), email (unique), password (bcrypt, select:false), profilePicture, bio, settings{theme, units, notifications{}, reminderTimes{workout, meals{}}}, timestamps
- **Workout**: user, name, category (strength|cardio|flexibility|sports), tags[], notes, date, exercises[]
- **Meal**: user, mealType (breakfast|lunch|dinner|snack), date, items[{name, quantity, calories, protein, carbs, fat}]
- **Progress**: user, date, weight, chest, waist, hips, arm, runTime, liftWeight, notes
- **Feedback**: user, type, subject, message, status (open|in-review|resolved)

## Error Format

`{ "message": "human readable error" }` with proper status codes (400/401/404/409/429/500)

## Rate Limits

- Global API: 300 requests / 15 min / IP
- Auth endpoints: 30 requests / 15 min / IP