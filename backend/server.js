const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

//  issues array
let issues = [
  { id: 1, title: 'Issue 1', description: 'Description of Issue 1' },
  { id: 2, title: 'Issue 2', description: 'Description of Issue 2' },
  { id: 3, title: 'Issue 3', description: 'Description of Issue 3' }
];

// Create POST
app.post('/api/issues', (req, res) => {
  const newIssue = { id: issues.length + 1, ...req.body };
  issues.push(newIssue);
  res.status(201).json(newIssue);
});

// Read  GET all issues
app.get('/api/issues', (req, res) => {
  res.json(issues);
});

// Update PUT
app.put('/api/issues/:id', (req, res) => {
  const { id } = req.params;
  const index = issues.findIndex(issue => issue.id == id);
  if (index !== -1) {
    issues[index] = { id: parseInt(id), ...req.body };
    res.json(issues[index]);
  } else {
    res.status(404).json({ message: 'Issue not found' });
  }
});

// Delete DELETE
app.delete('/api/issues/:id', (req, res) => {
  const { id } = req.params;
  const index = issues.findIndex(issue => issue.id == id);
  if (index !== -1) {
    issues.splice(index, 1);
    res.status(204).end();
  } else {
    res.status(404).json({ message: 'Issue not found' });
  }
});

// Start the server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
