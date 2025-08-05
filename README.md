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

## How to REQUEST Data from the Microservice

To request data from the reminder microservice, make HTTP requests to the appropriate endpoints. The microservice accepts standard HTTP methods (GET, POST, PUT, DELETE, PATCH).

### Example Request - Get All Reminders:
```javascript
// Make a GET request to retrieve all reminders
const response = await fetch('http://localhost:3001/api/reminders', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Parse the JSON response
const result = await response.json();
console.log(result); // { success: true, data: [...reminders] }
```

### Example Request - Create a New Reminder:
```javascript
// Make a POST request to create a new reminder
const response = await fetch('http://localhost:3001/api/reminders', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'Finish project documentation',  // Required field
    description: 'Complete the API docs',    // Optional
    dueDate: '2024-12-25',                  // Optional
    priority: 'high'                        // Optional: 'low', 'medium', 'high'
  })
});

const result = await response.json();
console.log(result); // { success: true, data: { id: '...', title: '...', ... } }
```

## How to RECEIVE Data from the Microservice

The microservice returns JSON responses with a consistent structure. All responses include a `success` field indicating if the operation was successful.

### Successful Response Format:
```javascript
{
  "success": true,
  "data": {
    // Response data here (single reminder object or array of reminders)
  }
}
```

### Error Response Format:
```javascript
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

### Example - Receiving and Processing Data:
```javascript
// Function to get a specific reminder by ID
async function getReminderById(reminderId) {
  try {
    const response = await fetch(`http://localhost:3001/api/reminders/${reminderId}`);
    const result = await response.json();
    
    if (result.success) {
      // Successfully received the reminder
      const reminder = result.data;
      console.log('Reminder:', reminder);
      // Process the reminder data as needed
      return reminder;
    } else {
      // Handle error case
      console.error('Error:', result.error);
      return null;
    }
  } catch (error) {
    console.error('Network error:', error);
    return null;
  }
}

// Example usage
const reminder = await getReminderById('some-uuid-here');
```

## API Endpoints

- `GET /api/reminders` - Get all reminders
- `GET /api/reminders/:id` - Get single reminder
- `POST /api/reminders` - Create reminder
- `PUT /api/reminders/:id` - Update reminder
- `DELETE /api/reminders/:id` - Delete reminder
- `PATCH /api/reminders/:id/complete` - Mark as complete
- `GET /api/health` - Health check

## Reminder Data Structure

Each reminder object contains:
```javascript
{
  "id": "unique-uuid",
  "title": "Reminder title",
  "description": "Optional description",
  "dueDate": "2024-12-25 or null",
  "priority": "low|medium|high",
  "completed": false,
  "createdAt": "ISO timestamp",
  "updatedAt": "ISO timestamp"
}
```

## UML Sequence Diagram

The following diagram shows the detailed flow of requesting and receiving data from the microservice:

![Sequence Diagram](UML%20Sequence.png)