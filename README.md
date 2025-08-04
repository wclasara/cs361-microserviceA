# Reminder System API

A simple REST API for managing reminders with persistent JSON storage.

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

The API runs on http://localhost:3001

## Testing the API

### Test all endpoints:
```bash
node test-api.js
```

### Test data persistence:
```bash
node test-persistence.js
```

## Features

- ✅ Create, read, update, and delete reminders
- ✅ Mark reminders as complete
- ✅ Priority levels (low, medium, high)
- ✅ Due dates
- ✅ Persistent storage in `reminders.json`
- ✅ Data survives server restarts

## API Endpoints

- `GET /api/reminders` - Get all reminders
- `GET /api/reminders/:id` - Get single reminder
- `POST /api/reminders` - Create reminder
- `PUT /api/reminders/:id` - Update reminder
- `DELETE /api/reminders/:id` - Delete reminder
- `PATCH /api/reminders/:id/complete` - Mark as complete
- `GET /api/health` - Health check

See `API_DOCUMENTATION.md` for full details.

## Example Usage (React)

```javascript
// Fetch reminders
const response = await fetch('http://localhost:3001/api/reminders');
const { data } = await response.json();

// Create reminder
const newReminder = await fetch('http://localhost:3001/api/reminders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Team Meeting',
    description: 'Weekly sync',
    priority: 'high'
  })
});
```