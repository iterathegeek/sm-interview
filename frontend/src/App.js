import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Button, TextField, Card, CardContent, CardActions, Grid } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

// Constants for the base URL
const baseURL = 'http://localhost:4000/api/issues';

const App = () => {
  const [issues, setIssues] = useState([]);
  const [newIssue, setNewIssue] = useState({ title: '', description: '' });

  useEffect(() => {
    axios.get(baseURL)
      .then((response) => setIssues(response.data))
      .catch((error) => console.error('Error fetching issues:', error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewIssue({ ...newIssue, [name]: value });
  };

  const createIssue = () => {
    axios.post(baseURL, newIssue)
      .then(() => {
        setIssues([...issues, newIssue]);
        setNewIssue({ title: '', description: '' });
      })
      .catch((error) => console.error('Error creating issue:', error));
  };

  const updateIssue = (id) => {
    const updatedIssue = issues.find((issue) => issue.id === id);
    axios.put(`${baseURL}/${id}`, updatedIssue)
      .then(() => {
        setIssues(issues.map((issue) => (issue.id === id ? updatedIssue : issue)));
      })
      .catch((error) => console.error('Error updating issue:', error));
  };

  const deleteIssue = (id) => {
    axios.delete(`${baseURL}/${id}`)
      .then(() => {
        setIssues(issues.filter((issue) => issue.id !== id));
      })
      .catch((error) => console.error('Error deleting issue:', error));
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Issue Manager
      </Typography>

      <Card style={{ marginBottom: '20px' }}>
        <CardContent>
          <TextField
            label="Title"
            name="title"
            value={newIssue.title}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            name="description"
            value={newIssue.description}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
        </CardContent>
        <CardActions>
          <Button
            variant="contained"
            color="primary"
            onClick={createIssue}
            startIcon={<FontAwesomeIcon icon={faPlus} />}
          >
            Add Issue
          </Button>
        </CardActions>
      </Card>

      <Grid container spacing={2}>
        {issues.map((issue) => (
          <Grid item xs={12} key={issue.id}>
            <Card>
              <CardContent>
                <Typography variant="h5">{issue.title}</Typography>
                <Typography variant="body1">{issue.description}</Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => updateIssue(issue.id)}
                  startIcon={<FontAwesomeIcon icon={faEdit} />}
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => deleteIssue(issue.id)}
                  startIcon={<FontAwesomeIcon icon={faTrash} />}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default App;
