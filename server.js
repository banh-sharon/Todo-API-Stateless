// server.js
const express = require('express');
const path = require('path');
const db = require('./db'); // Import database connection
const app = express();
const port = 3000;

// Middleware
app.use(express.json());           // for parsing application/json
app.use(express.static('public')); // for serving static files (index.html, script.js, style.css)

// Serve the frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// GET all todo items
app.get('/todos', (req, res) => {
  db.all('SELECT * FROM todos', (err, rows) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    res.json(rows);
  });
});

// GET a specific todo item by ID
app.get('/todos/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM todos WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    if (row) {
      res.json(row);
    } else {
      res.status(404).json({ message: 'Todo item not found' });
    }
  });
});

// POST a new todo item
app.post('/todos', (req, res) => {
  const { name, priority = 'low', isFun = true } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Name is required' });
  }

  db.run(
    'INSERT INTO todos (name, priority, isComplete, isFun) VALUES (?, ?, ?, ?)',
    [name, priority, false, isFun],
    function (err) {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      db.get('SELECT * FROM todos WHERE id = ?', [this.lastID], (err, row) => {
        if (err) {
          return res.status(500).json({ message: err.message });
        }
        res.status(201).json(row);
      });
    }
  );
});

// DELETE a todo item by ID
app.delete('/todos/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM todos WHERE id = ?', [id], function (err) {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    if (this.changes > 0) {
      res.json({ message: `Todo item ${id} deleted.` });
    } else {
      res.status(404).json({ message: 'Todo item not found' });
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Todo API server running at http://localhost:${port}`);
});
