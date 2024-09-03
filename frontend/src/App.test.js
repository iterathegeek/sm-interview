import { render, screen } from '@testing-library/react';
import App from './App';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import axiosMock from 'axios-mock-adapter';
import App from './App';

const mock = new axiosMock(axios);

describe('App', () => {
  beforeEach(() => {
    mock.reset();
  });

  it('should display issues from the server', async () => {
    const issues = [
      { id: 1, title: 'Test Issue 1', description: 'Description 1' },
      { id: 2, title: 'Test Issue 2', description: 'Description 2' },
    ];
    mock.onGet('http://localhost:4000/api/issues').reply(200, issues);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Test Issue 1')).toBeInTheDocument();
      expect(screen.getByText('Test Issue 2')).toBeInTheDocument();
    });
  });

  it('should create a new issue', async () => {
    const newIssue = { id: 3, title: 'New Issue', description: 'New Description' };
    mock.onPost('http://localhost:4000/api/issues').reply(200, newIssue);

    render(<App />);

    fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: newIssue.title } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: newIssue.description } });

    fireEvent.click(screen.getByText(/Add Issue/i));

    await waitFor(() => {
      expect(screen.getByText('New Issue')).toBeInTheDocument();
    });
  });

  it('should update an issue', async () => {
    const issue = { id: 1, title: 'Updated Issue', description: 'Updated Description' };
    mock.onPut(`http://localhost:4000/api/issues/${issue.id}`).reply(200, issue);

    render(<App />);

    fireEvent.click(screen.getAllByText(/Edit/i)[0]);

    await waitFor(() => {
      expect(screen.getByText('Updated Issue')).toBeInTheDocument();
    });
  });

  it('should delete an issue', async () => {
    const issue = { id: 1, title: 'Test Issue 1', description: 'Description 1' };
    mock.onDelete(`http://localhost:4000/api/issues/${issue.id}`).reply(200);

    render(<App />);

    fireEvent.click(screen.getAllByText(/Delete/i)[0]);

    await waitFor(() => {
      expect(screen.queryByText('Test Issue 1')).not.toBeInTheDocument();
    });
  });
});
