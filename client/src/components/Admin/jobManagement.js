import React, { useEffect, useState } from 'react';
import axios from 'axios';

const JobManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('/api/admin/jobs'); // Adjust the endpoint as necessary
        setJobs(response.data.data);
      } catch (err) {
        setError(err.response ? err.response.data.message : 'Error fetching jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleDelete = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await axios.delete(`/api/jobs/${jobId}`); // Adjust the endpoint as necessary
        setJobs(jobs.filter(job => job._id !== jobId));
      } catch (err) {
        setError(err.response ? err.response.data.message : 'Error deleting job');
      }
    }
  };

  const handleStatusUpdate = async (jobId, newStatus) => {
    try {
      const response = await axios.patch(`/api/jobs/${jobId}/status`, { status: newStatus }); // Adjust the endpoint as necessary
      setJobs(jobs.map(job => (job._id === jobId ? { ...job, jobStatus: response.data.data.jobStatus } : job)));
    } catch (err) {
      setError(err.response ? err.response.data.message : 'Error updating job status');
    }
  };

  if (loading) return <p>Loading jobs...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Job Management</h1>
      <table>
        <thead>
          <tr>
            <th>Job Title</th>
            <th>Description</th>
            <th>Location</th>
            <th>Industry</th>
            <th>Employment Type</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map(job => (
            <tr key={job._id}>
              <td>{job.jobTitle}</td>
              <td>{job.jobDescription}</td>
              <td>{job.jobLocation}</td>
              <td>{job.industry}</td>
              <td>{job.employmentType}</td>
              <td>
                <select
                  value={job.jobStatus}
                  onChange={(e) => handleStatusUpdate(job._id, e.target.value)}
                >
                  <option value="Open">Open</option>
                  <option value="Closed">Closed</option>
                </select>
              </td>
              <td>
                <button onClick={() => handleDelete(job._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default JobManagement;
