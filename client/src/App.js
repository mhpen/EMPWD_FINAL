import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CreateEmployer from './components/Employer/registerEmployer';
import CreateJobSeeker from './components/JobSeeker/registerJobSeeker';
import JobPostingForm from './components/Employer/JobPostingForm';
import Login from './components/Auth/loginComponent';
import AdminLogin from './components/Auth/adminLogin'; // Import AdminLogin component
import AdminRegister from './components/Auth/adminRegister'; // Import AdminRegister component
import JobsDashboard from './components/Employer/jobDashboard';
import Usertype from './components/Auth/userTypeComponent';
import JobList from './components/JobSeeker/JobBoard';
import JobDetails from './components/JobSeeker/JobDetails';
import JobApplication from './components/JobSeeker/JobApplicationComp';
import ViewJob from './components/Employer/viewJob';
import EditJob from './components/Employer/editJob';
import DebugManageJobs from './components/debugComponent';
import ApplicationDashboard from './components/Employer/jobApplication';
import JobManagement from './components/Admin/jobManagement'; // New JobManagement component
import HomePageComponent from './components/Home/homePage';


const App = () => {
  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Main job board route */}
          <Route path="/" element={<HomePageComponent />} />
          <Route path="/job-list" element={<JobList />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/employers/view-job/:jobId" element={<ViewJob />} />
          <Route path="/debug" element={<DebugManageJobs />} />
          <Route path='/employer/application' element={<ApplicationDashboard />} />
          <Route path="/employers/edit-job/:jobId" element={<EditJob />} />
          <Route path="/login" element={<Login />} />
          
          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegister />} />
          <Route path="/admin/job-management" element={<JobManagement />} />

          <Route path="/jobs/:id/apply" element={<JobApplication />} />
          <Route path="/create-employer" element={<CreateEmployer />} />
          <Route path="/RegisterjobSeeker" element={<CreateJobSeeker />} />
          <Route path="/job-dashboard" element={<JobsDashboard />} />
          <Route path="/employers/create-job" element={<JobPostingForm />} />
          <Route path="/user-type" element={<Usertype />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
