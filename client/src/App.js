import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CreateEmployer from './components/Employer/registerEmployer';
import CreateJobSeeker from './components/JobSeeker/registerJobSeeker';
import JobPostingForm from './components/Employer/JobPostingForm';
import Login from './components/Auth/loginComponent';
import JobsDashboard from './components/Employer/jobDashboard';
import Usertype from './components/Auth/userTypeComponent';
import JobBoard from './components/JobSeeker/JobBoard.js'; // The job board we created earlier
import JobDetails from './components/JobSeeker/JobDetails'; // You'll need to create this
import JobApplication from './components/JobSeeker/JobApplicationComp';
import ViewJob from './components/Employer/viewJob';

const App = () => {
  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Main job board route */}
          <Route path="/job-list" element={<JobBoard />} />
          <Route path="/jobs" element={<JobBoard />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/employers/view-job/:jobId" element={<ViewJob />} />

          {/* Existing routes */}
          <Route path="/job-application" element={<JobApplication/>} />
          <Route path="/create-employer" element={<CreateEmployer />} />
          <Route path="/RegisterjobSeeker" element={<CreateJobSeeker />} />
          <Route path="/job-dashboard" element={<JobsDashboard />} />
          <Route path="/" element={<Login />} />
          <Route path="/create-job" element={<JobPostingForm />} />
          <Route path="/user-type" element={<Usertype />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;