import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [issues, setIssues] = useState([]);
  const [newIssue, setNewIssue] = useState({ title: '', description: '' });

  useEffect(() => {
    axios.get('http://localhost:4000/api/issues')
      .then(response => setIssues(response.data))
      .catch(error => console.error('Error fetching issues:', error));
  }, []);

  const handleAddIssue = () => {
    axios.post('http://localhost:4000/api/issues', newIssue)
      .then(response => setIssues([...issues, response.data]))
      .catch(error => console.error('Error adding issue:', error));
  };

  const handleUpdateIssue = (id) => {
    const updatedIssue = { title: 'Updated Title', description: 'Updated Description' };
    axios.put(`http://localhost:4000/api/issues/${id}`, updatedIssue)
      .then(response => setIssues(issues.map(issue => issue.id === id ? response.data : issue)))
      .catch(error => console.error('Error updating issue:', error));
  };

  const handleDeleteIssue = (id) => {
    axios.delete(`http://localhost:4000/api/issues/${id}`)
      .then(() => setIssues(issues.filter(issue => issue.id !== id)))
      .catch(error => console.error('Error deleting issue:', error));
  };

  return (
    <div className="App">
      <h1>Issues Tracker</h1>
      <div>
        <input
          type="text"
          placeholder="Title"
          value={newIssue.title}
          onChange={(e) => setNewIssue({ ...newIssue, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          value={newIssue.description}
          onChange={(e) => setNewIssue({ ...newIssue, description: e.target.value })}
        />
        <button onClick={handleAddIssue}>Add Issue</button>
      </div>
      <ul>
        {issues.map(issue => (
          <li key={issue.id}>
            <h3>{issue.title}</h3>
            <p>{issue.description}</p>
            <button onClick={() => handleUpdateIssue(issue.id)}>Update</button>
            <button onClick={() => handleDeleteIssue(issue.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
