import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CreateEmployer from './components/Employer/registerEmployer'; // Ensure this path is correct
import CreateJobSeeker from './components/JobSeeker/registerJobSeeker';
import JobPostingForm from './components/Employer/JobPostingForm'; 
import Login from './components/Auth/loginComponent';
import JobsDashboard from './components/Employer/jobDashboard';

const App = () => {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/create-employer" element={<CreateEmployer />} /> {/* Employer Registration */}
          <Route path="/RegisterjobSeeker" element={<CreateJobSeeker />} /> {/* JobSeeker Registration */}
          <Route path="/job-dashboard" element={<JobsDashboard />} />
          <Route path="/login" element={<Login />} /> {/* Login */}
          <Route path="/create-job" element={<JobPostingForm />} /> {/* Job Posting Form */}
          
          {/* Other routes can be added here */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;