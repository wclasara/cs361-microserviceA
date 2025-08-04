const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_FILE = path.join(__dirname, 'reminders.json');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Storage for reminders
let reminders = [];

// File operations
async function loadReminders() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    reminders = JSON.parse(data);
    console.log(`Loaded ${reminders.length} reminders from file`);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // File doesn't exist, create it with empty array
      await saveReminders();
      console.log('Created new reminders.json file');
    } else {
      console.error('Error loading reminders:', error);
    }
  }
}

async function saveReminders() {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(reminders, null, 2));
  } catch (error) {
    console.error('Error saving reminders:', error);
    throw error;
  }
}

// Routes
// Get all reminders
app.get('/api/reminders', (req, res) => {
  console.log(`[${new Date().toISOString()}] GET /api/reminders - Fetching all reminders`);
  res.json({ success: true, data: reminders });
});

// Get a single reminder by ID
app.get('/api/reminders/:id', (req, res) => {
  console.log(`[${new Date().toISOString()}] GET /api/reminders/${req.params.id} - Fetching single reminder`);
  const reminder = reminders.find(r => r.id === req.params.id);
  
  if (!reminder) {
    return res.status(404).json({ 
      success: false, 
      error: 'Reminder not found' 
    });
  }
  
  res.json({ success: true, data: reminder });
});

// Create a new reminder
app.post('/api/reminders', async (req, res) => {
  const { title, description, dueDate, priority } = req.body;
  console.log(`[${new Date().toISOString()}] POST /api/reminders - Creating new reminder with title: "${title}"`)
  
  // Basic validation
  if (!title) {
    return res.status(400).json({ 
      success: false, 
      error: 'Title is required' 
    });
  }
  
  const newReminder = {
    id: uuidv4(),
    title,
    description: description || '',
    dueDate: dueDate || null,
    priority: priority || 'medium',
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  reminders.push(newReminder);
  
  // Save to file
  try {
    await saveReminders();
    res.status(201).json({ success: true, data: newReminder });
  } catch (error) {
    // Remove from memory if save failed
    reminders.pop();
    res.status(500).json({ success: false, error: 'Failed to save reminder' });
  }
});

// Update a reminder
app.put('/api/reminders/:id', async (req, res) => {
  console.log(`[${new Date().toISOString()}] PUT /api/reminders/${req.params.id} - Updating reminder`);
  const index = reminders.findIndex(r => r.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ 
      success: false, 
      error: 'Reminder not found' 
    });
  }
  
  const { title, description, dueDate, priority, completed } = req.body;
  
  reminders[index] = {
    ...reminders[index],
    ...(title !== undefined && { title }),
    ...(description !== undefined && { description }),
    ...(dueDate !== undefined && { dueDate }),
    ...(priority !== undefined && { priority }),
    ...(completed !== undefined && { completed }),
    updatedAt: new Date().toISOString()
  };
  
  try {
    await saveReminders();
    res.json({ success: true, data: reminders[index] });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to save changes' });
  }
});

// Delete a reminder
app.delete('/api/reminders/:id', async (req, res) => {
  console.log(`[${new Date().toISOString()}] DELETE /api/reminders/${req.params.id} - Deleting reminder`);
  const index = reminders.findIndex(r => r.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ 
      success: false, 
      error: 'Reminder not found' 
    });
  }
  
  const deletedReminder = reminders.splice(index, 1)[0];
  
  try {
    await saveReminders();
    res.json({ success: true, data: deletedReminder });
  } catch (error) {
    // Restore if save failed
    reminders.splice(index, 0, deletedReminder);
    res.status(500).json({ success: false, error: 'Failed to delete reminder' });
  }
});

// Mark a reminder as completed
app.patch('/api/reminders/:id/complete', async (req, res) => {
  console.log(`[${new Date().toISOString()}] PATCH /api/reminders/${req.params.id}/complete - Marking reminder as completed`);
  const index = reminders.findIndex(r => r.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ 
      success: false, 
      error: 'Reminder not found' 
    });
  }
  
  reminders[index].completed = true;
  reminders[index].updatedAt = new Date().toISOString();
  
  try {
    await saveReminders();
    res.json({ success: true, data: reminders[index] });
  } catch (error) {
    reminders[index].completed = false;
    res.status(500).json({ success: false, error: 'Failed to update reminder' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  console.log(`[${new Date().toISOString()}] GET /api/health - Health check`);
  res.json({ status: 'OK', service: 'Reminder API', version: '1.0.0' });
});

// Initialize and start server
async function startServer() {
  await loadReminders();
  
  app.listen(PORT, () => {
    console.log(`Reminder API server running on port ${PORT}`);
    console.log(`Data file: ${DATA_FILE}`);
  });
}

startServer().catch(console.error);