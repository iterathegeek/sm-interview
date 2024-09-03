const request = require('supertest');
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

// Setup Express app
const app = express();
app.use(cors());
app.use(express.json());

const issues = [
  { id: 1, title: 'Issue 1', description: 'Description 1' },
  { id: 2, title: 'Issue 2', description: 'Description 2' },
];

app.get('/api/issues', (req, res) => res.json(issues));

app.post('/api/issues', (req, res) => {
  const newIssue = req.body;
  issues.push(newIssue);
  res.status(201).json(newIssue);
});

app.put('/api/issues/:id', (req, res) => {
  const { id } = req.params;
  const updatedIssue = req.body;
  const index = issues.findIndex(issue => issue.id == id);
  if (index !== -1) {
    issues[index] = updatedIssue;
    res.status(200).json(updatedIssue);
  } else {
    res.status(404).json({ error: 'Issue not found' });
  }
});

app.delete('/api/issues/:id', (req, res) => {
  const { id } = req.params;
  const index = issues.findIndex(issue => issue.id == id);
  if (index !== -1) {
    const deletedIssue = issues.splice(index, 1);
    res.status(200).json(deletedIssue);
  } else {
    res.status(404).json({ error: 'Issue not found' });
  }
});

describe('API Endpoints', () => {
  test('GET /api/issues should return issues', async () => {
    const response = await request(app).get('/api/issues');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(issues);
  });

  test('POST /api/issues should create a new issue', async () => {
    const newIssue = { id: 3, title: 'Issue 3', description: 'Description 3' };
    const response = await request(app).post('/api/issues').send(newIssue);
    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual(newIssue);
  });

  test('PUT /api/issues/:id should update an issue', async () => {
    const updatedIssue = { id: 1, title: 'Updated Issue 1', description: 'Updated Description 1' };
    const response = await request(app).put('/api/issues/1').send(updatedIssue);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(updatedIssue);
  });

  test('DELETE /api/issues/:id should delete an issue', async () => {
    const response = await request(app).delete('/api/issues/1');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([{ id: 1, title: 'Updated Issue 1', description: 'Updated Description 1' }]);
  });
});
