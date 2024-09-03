const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors()); // Enable CORS for all routes
app.use(express.json());

// Route to read issues from external JSON file
app.get('/api/issues', (req, res) => {
  fs.readFile(path.join(__dirname, 'data/issues.json'), 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading issues' });
    }
    res.json(JSON.parse(data));
  });
});

// Route to create a new issue
app.post('/api/issues', (req, res) => {
  const newIssue = req.body;
  fs.readFile(path.join(__dirname, 'issues.json'), 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading issues' });
    }
    const issues = JSON.parse(data);
    issues.push(newIssue);
    fs.writeFile(path.join(__dirname, 'issues.json'), JSON.stringify(issues, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error writing issues' });
      }
      res.status(201).json(newIssue);
    });
  });
});

// Route to update an issue
app.put('/api/issues/:id', (req, res) => {
  const { id } = req.params;
  const updatedIssue = req.body;
  fs.readFile(path.join(__dirname, 'issues.json'), 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading issues' });
    }
    const issues = JSON.parse(data);
    const index = issues.findIndex((issue) => issue.id == id);
    if (index !== -1) {
      issues[index] = updatedIssue;
      fs.writeFile(path.join(__dirname, 'issues.json'), JSON.stringify(issues, null, 2), (err) => {
        if (err) {
          return res.status(500).json({ error: 'Error writing issues' });
        }
        res.status(200).json(updatedIssue);
      });
    } else {
      res.status(404).json({ error: 'Issue not found' });
    }
  });
});

// Route to delete an issue
app.delete('/api/issues/:id', (req, res) => {
  const { id } = req.params;
  fs.readFile(path.join(__dirname, 'issues.json'), 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading issues' });
    }
    let issues = JSON.parse(data);
    const index = issues.findIndex((issue) => issue.id == id);
    if (index !== -1) {
      const deletedIssue = issues.splice(index, 1);
      fs.writeFile(path.join(__dirname, 'issues.json'), JSON.stringify(issues, null, 2), (err) => {
        if (err) {
          return res.status(500).json({ error: 'Error writing issues' });
        }
        res.status(200).json(deletedIssue);
      });
    } else {
      res.status(404).json({ error: 'Issue not found' });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
