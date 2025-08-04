# Reminder API Documentation

## Base URL
```
http://localhost:3001/api
```

## Endpoints

### 1. Get All Reminders
**GET** `/reminders`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-here",
      "title": "Team Meeting",
      "description": "Weekly team sync",
      "dueDate": "2024-12-30T10:00:00Z",
      "priority": "high",
      "completed": false,
      "createdAt": "2024-12-25T08:00:00Z",
      "updatedAt": "2024-12-25T08:00:00Z"
    }
  ]
}
```

### 2. Get Single Reminder
**GET** `/reminders/:id`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "title": "Team Meeting",
    "description": "Weekly team sync",
    "dueDate": "2024-12-30T10:00:00Z",
    "priority": "high",
    "completed": false,
    "createdAt": "2024-12-25T08:00:00Z",
    "updatedAt": "2024-12-25T08:00:00Z"
  }
}
```

### 3. Create Reminder
**POST** `/reminders`

**Request Body:**
```json
{
  "title": "Team Meeting",
  "description": "Weekly team sync",
  "dueDate": "2024-12-30T10:00:00Z",
  "priority": "high"
}
```

**Response:** 201 Created
```json
{
  "success": true,
  "data": {
    "id": "generated-uuid",
    "title": "Team Meeting",
    "description": "Weekly team sync",
    "dueDate": "2024-12-30T10:00:00Z",
    "priority": "high",
    "completed": false,
    "createdAt": "2024-12-25T08:00:00Z",
    "updatedAt": "2024-12-25T08:00:00Z"
  }
}
```

### 4. Update Reminder
**PUT** `/reminders/:id`

**Request Body:** (all fields optional)
```json
{
  "title": "Updated Team Meeting",
  "description": "New description",
  "dueDate": "2024-12-31T10:00:00Z",
  "priority": "medium",
  "completed": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "title": "Updated Team Meeting",
    "description": "New description",
    "dueDate": "2024-12-31T10:00:00Z",
    "priority": "medium",
    "completed": true,
    "createdAt": "2024-12-25T08:00:00Z",
    "updatedAt": "2024-12-25T09:00:00Z"
  }
}
```

### 5. Delete Reminder
**DELETE** `/reminders/:id`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "title": "Deleted Reminder",
    "description": "This was deleted",
    "dueDate": null,
    "priority": "low",
    "completed": false,
    "createdAt": "2024-12-25T08:00:00Z",
    "updatedAt": "2024-12-25T08:00:00Z"
  }
}
```

### 6. Mark Reminder as Complete
**PATCH** `/reminders/:id/complete`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "title": "Team Meeting",
    "description": "Weekly team sync",
    "dueDate": "2024-12-30T10:00:00Z",
    "priority": "high",
    "completed": true,
    "createdAt": "2024-12-25T08:00:00Z",
    "updatedAt": "2024-12-25T10:00:00Z"
  }
}
```

### 7. Health Check
**GET** `/health`

**Response:**
```json
{
  "status": "OK",
  "service": "Reminder API",
  "version": "1.0.0"
}
```

## Data Model

### Reminder Object
| Field | Type | Description | Required |
|-------|------|-------------|----------|
| id | string | Unique identifier (UUID) | Auto-generated |
| title | string | Reminder title | Yes |
| description | string | Detailed description | No (default: "") |
| dueDate | string/null | ISO 8601 date string | No (default: null) |
| priority | string | Priority level: "low", "medium", "high" | No (default: "medium") |
| completed | boolean | Completion status | No (default: false) |
| createdAt | string | ISO 8601 creation timestamp | Auto-generated |
| updatedAt | string | ISO 8601 last update timestamp | Auto-generated |

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": "Title is required"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Reminder not found"
}
```

## Usage Example (React)

```javascript
// Fetch all reminders
const fetchReminders = async () => {
  const response = await fetch('http://localhost:3001/api/reminders');
  const data = await response.json();
  return data.data;
};

// Create a reminder
const createReminder = async (reminder) => {
  const response = await fetch('http://localhost:3001/api/reminders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reminder),
  });
  const data = await response.json();
  return data.data;
};
```

## Data Storage

The API uses persistent JSON file storage. All reminders are saved to `reminders.json` in the project directory. This file is:
- Created automatically on first run if it doesn't exist
- Updated after every create, update, or delete operation
- Loaded when the server starts

## Running the API

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

The API will run on port 3001 by default. You can change this by setting the PORT environment variable.

**Note:** The `reminders.json` file will be created in the same directory as `server.js` when you first run the application.