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
import UserManagementSystem from './components/Admin/userManagement';
import SeekerProfile from './components/JobSeeker/profile';
import MyApplicationDetails from './components/JobSeeker/myApplication';
import AdminDashboard from './components/Admin/adminDashboard';
import UserDetailsView from './components/Admin/userDetails'; // New JobManagement component
import UserReview from './components/Admin/userReview';
import NotFoundPage from './components/ui/404notFound';
import JobDetailsAdmin from './components/Admin/JobDetails';
import Messages from './components/messages/MessageModal';
import Conversation from './components/messages/Conversation';
import MessagesPage from './components/messages/MessagesPage';


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
          <Route path="/seeker/profile" element={<SeekerProfile />} />
          <Route path="/admin/users/:userId" element={<UserDetailsView />} />


          
          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegister />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/jobs" element={<JobManagement />} />
          <Route path="/admin/jobs/:id" element={<JobDetailsAdmin />} />
          


          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/job-management" element={<JobManagement />} />
          <Route path="/admin/user-management" element={<UserManagementSystem />} />
          <Route path="/admin/users/:userId/review" element={<UserReview />} />


          <Route path="/jobs/:id/apply" element={<JobApplication />} />
          <Route path="/my-application" element={<MyApplicationDetails />} />

          <Route path="/create-employer" element={<CreateEmployer />} />
          <Route path="/RegisterjobSeeker" element={<CreateJobSeeker />} />
          <Route path="/job-dashboard" element={<JobsDashboard />} />
          <Route path="/employers/create-job" element={<JobPostingForm />} />
          <Route path="/user-type" element={<Usertype />} />

          <Route path="/messages/conversation/:userId" element={<Conversation />} />
          <Route path="/messages" element={<MessagesPage />} />

          <Route path="/employer/applications" element={<ApplicationDashboard />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
