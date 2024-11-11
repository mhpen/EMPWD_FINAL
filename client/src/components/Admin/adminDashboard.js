import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Users, Briefcase, FileCheck, Verified, X } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import SidebarAdmin from './sideNavAdmin';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [monthlyTrends, setMonthlyTrends] = useState([]);
  const [pendingJobs, setPendingJobs] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const navigate = useNavigate();

  
  useEffect(() => {
    // Fetch platform statistics
    axios.get('/api/admin/dashboard/stats')
      .then(response => {
        if (response.data.success) {
          setStats(response.data.data);
        }
      })
      .catch(error => {
        console.error('Error fetching platform statistics:', error);
      });

    // Fetch monthly trends
    axios.get('/api/admin/dashboard/trends')
      .then(response => {
        if (response.data.success) {
          setMonthlyTrends(response.data.data);
        }
      })
      .catch(error => {
        console.error('Error fetching monthly trends:', error);
      });

    // Fetch pending jobs
    axios.get('/api/admin/dashboard/pending-jobs')
      .then(response => {
        if (response.data.success) {
          setPendingJobs(response.data.data);
        }
      })
      .catch(error => {
        console.error('Error fetching pending jobs:', error);
      });

    // Fetch pending users
    axios.get('/api/admin/dashboard/pending-users')
      .then(response => {
      if (response.data.success) {
        setPendingUsers(response.data.data);
      }
    })
    .catch(error => {
      console.error('Error fetching pending users:', error);
    })
  }, []);

  const updateJobStatus = (jobId, newStatus) => {
    axios.patch(`/api/admin/dashboard/jobs/${jobId}/status`, { status: newStatus })
      .then(response => {
        if (response.data.success) {
          setPendingJobs(pendingJobs.map(job =>
            job.id === jobId ? { ...job, status: newStatus } : job
          ));
        }
      })
      .catch(error => {
        console.error('Error updating job status:', error);
      });
  };

  if (!stats) {
    return <div>Loading...</div>;
  }

  console.log("Stats: ", stats);
  console.log("Trends: ", monthlyTrends);
  console.log("Pending Jobs: ", pendingJobs);
  console.log("Pending Users: ", pendingUsers);


  return (
    <div className="flex h-screen bg-gray-50 font-poppins">
      <div className="w-1/5 flex-shrink-0">
        <SidebarAdmin />
      </div>

      <div className="w-4/5 overflow-y-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500 mt-1">Overview and management of platform activities</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-500">Last updated:</p>
              <p className="text-s font-medium">{new Date().toLocaleDateString()}</p>
            </div>
            {/* <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Generate Report
            </button> */}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Job Seekers
              </CardTitle>
              <Users className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSeekers.toLocaleString()}</div>
              <p className="text-xs text-gray-500 mt-1">Total Job Seekers in the platform</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Employers
              </CardTitle>
              <Briefcase className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEmployers.toLocaleString()}</div>
              <p className="text-xs text-gray-500 mt-1">Total Employers in the platform</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Jobs  {/* Updated to display Total Jobs */}
              </CardTitle>
              <FileCheck className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalJobs.toLocaleString()}</div> {/* Use totalJobs from stats */}
              <p className="text-xs text-gray-500 mt-1">Total jobs available</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Unverified Users {/* Updated to display Total Verified Users */}
              </CardTitle>
              <X className="h-5 w-5 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUnverifiedUsers.toLocaleString()}</div> {/* Use totalVerifiedUsers from stats */}
              <p className="text-xs text-gray-500 mt-1">Unverified users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Verified Users
              </CardTitle>
              <Verified className="h-5 w-5 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalVerifiedUsers.toLocaleString()}</div>
              <p className="text-xs text-gray-500 mt-1">Verified users</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Platform Growth Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="seekers" stroke="#2563eb" name="Job Seekers" />
                    <Line type="monotone" dataKey="employers" stroke="#16a34a" name="Employers" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Growth</CardTitle> {/* Updated here */}
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="jobs" fill="#8b5cf6" name="Total Jobs" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Pending Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Email</th>
                    <th className="text-left py-3 px-4">Role</th>
                    <th className="text-left py-3 px-4">Date Created</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-right py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingUsers.map((pendingUsers) => (
                    <tr key={pendingUsers.id} className="border-b">
                      <td className="py-3 px-4">{pendingUsers.email}</td>
                      <td className="py-3 px-4">{pendingUsers.role}</td>
                      <td className="py-3 px-4">{new Date(pendingUsers.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 px-4 text-orange-600 font-semibold">
                      {pendingUsers.status ? "Verified" : "Unverified"}</td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => navigate('/admin/user-management')}/*updateJobStatus(pendingUsers.id, 'Approved'*/
                          className="text-blue-600 hover:underline"
                        >
                          Approve
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;




































// import React from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
// import { Users, Briefcase, FileCheck, Clock, TrendingUp, Calendar, DollarSign, Target, UserCheck, AlertCircle } from "lucide-react";
// import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
// import SidebarAdmin from './sideNavAdmin';

// const AdminDashboard = () => {
//   // Sample data - replace with your actual data
//   const stats = {
//     totalSeekers: 12456,
//     totalEmployers: 892,
//     activeJobs: 1234,
//     pendingApplications: 345,
//     monthlyGrowth: 23.5,
//     interviews: 567,
//     premiumEmployers: 234,
//     completedJobs: 789,
//     activeUsers: 5678,
//     reportedJobs: 12
//   };

//   const monthlyStats = [
//     { name: 'Jan', seekers: 9800, employers: 750, jobs: 980 },
//     { name: 'Feb', seekers: 10200, employers: 790, jobs: 1050 },
//     { name: 'Mar', seekers: 11000, employers: 810, jobs: 1150 },
//     { name: 'Apr', seekers: 11500, employers: 850, jobs: 1200 },
//     { name: 'May', seekers: 12000, employers: 870, jobs: 1180 },
//     { name: 'Jun', seekers: 12456, employers: 892, jobs: 1234 },
//   ];

//   const pendingJobs = [
//     { id: 1, company: "Tech Corp", position: "Senior Developer", location: "New York", date: "2024-11-03", status: "Pending Review" },
//     { id: 2, company: "Marketing Pro", position: "Digital Marketing Manager", location: "Remote", date: "2024-11-03", status: "Documents Required" },
//     { id: 3, company: "Finance Plus", position: "Financial Analyst", location: "London", date: "2024-11-02", status: "Pending Review" },
//     { id: 4, company: "Healthcare Inc", position: "Medical Assistant", location: "Chicago", date: "2024-11-02", status: "Pending Review" },
//     { id: 5, company: "Education First", position: "Math Teacher", location: "Boston", date: "2024-11-01", status: "Documents Required" },
//   ];

//   return (
//     <div className="flex h-screen bg-gray-50 font-poppins">
//       {/* Sidebar with explicit 20% width */}
//       <div className="w-1/5 flex-shrink-0">
//         <SidebarAdmin />
//       </div>
      
//       {/* Main content area with explicit 80% width */}
//       <div className="w-4/5 overflow-y-auto p-6 space-y-6">
//         {/* Header */}
//         <div className="flex justify-between items-center">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
//             <p className="text-gray-500 mt-1">Overview and management of platform activities</p>
//           </div>
//           <div className="flex items-center gap-4">
//             <div className="text-right">
//               <p className="text-sm text-gray-500">Last updated:</p>
//               <p className="text-sm font-medium">{new Date().toLocaleDateString()}</p>
//             </div>
//             <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
//               Generate Report
//             </button>
//           </div>
//         </div>

//         {/* Main Stats Grid - adjusted for better fit in 80% width */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between pb-2">
//               <CardTitle className="text-sm font-medium text-gray-500">
//                 Total Job Seekers
//               </CardTitle>
//               <Users className="h-5 w-5 text-blue-600" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">{stats.totalSeekers.toLocaleString()}</div>
//               <p className="text-xs text-gray-500 mt-1">↑ 12% vs last month</p>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between pb-2">
//               <CardTitle className="text-sm font-medium text-gray-500">
//                 Total Employers
//               </CardTitle>
//               <Briefcase className="h-5 w-5 text-green-600" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">{stats.totalEmployers.toLocaleString()}</div>
//               <p className="text-xs text-gray-500 mt-1">↑ 8% vs last month</p>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between pb-2">
//               <CardTitle className="text-sm font-medium text-gray-500">
//                 Active Jobs
//               </CardTitle>
//               <FileCheck className="h-5 w-5 text-purple-600" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">{stats.activeJobs.toLocaleString()}</div>
//               <p className="text-xs text-gray-500 mt-1">Across all categories</p>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between pb-2">
//               <CardTitle className="text-sm font-medium text-gray-500">
//                 Premium Employers
//               </CardTitle>
//               <DollarSign className="h-5 w-5 text-yellow-600" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">{stats.premiumEmployers.toLocaleString()}</div>
//               <p className="text-xs text-gray-500 mt-1">Active subscriptions</p>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between pb-2">
//               <CardTitle className="text-sm font-medium text-gray-500">
//                 Monthly Growth
//               </CardTitle>
//               <TrendingUp className="h-5 w-5 text-emerald-600" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">+{stats.monthlyGrowth}%</div>
//               <p className="text-xs text-gray-500 mt-1">Overall platform growth</p>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Graphs Section - adjusted for better fit in 80% width */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>Platform Growth Trends</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="h-64">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <LineChart data={monthlyStats}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="name" />
//                     <YAxis />
//                     <Tooltip />
//                     <Line type="monotone" dataKey="seekers" stroke="#2563eb" name="Job Seekers" />
//                     <Line type="monotone" dataKey="employers" stroke="#16a34a" name="Employers" />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader>
//               <CardTitle>Monthly Active Jobs</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="h-64">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <BarChart data={monthlyStats}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="name" />
//                     <YAxis />
//                     <Tooltip />
//                     <Bar dataKey="jobs" fill="#8b5cf6" name="Active Jobs" />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Pending Jobs Table */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Recent Pending Jobs</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead>
//                   <tr className="border-b">
//                     <th className="text-left py-3 px-4">Company</th>
//                     <th className="text-left py-3 px-4">Position</th>
//                     <th className="text-left py-3 px-4">Location</th>
//                     <th className="text-left py-3 px-4">Date</th>
//                     <th className="text-left py-3 px-4">Status</th>
//                     <th className="text-right py-3 px-4">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {pendingJobs.map((job) => (
//                     <tr key={job.id} className="border-b hover:bg-gray-50">
//                       <td className="py-3 px-4">{job.company}</td>
//                       <td className="py-3 px-4 font-medium">{job.position}</td>
//                       <td className="py-3 px-4">{job.location}</td>
//                       <td className="py-3 px-4">{job.date}</td>
//                       <td className="py-3 px-4">
//                         <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
//                           {job.status}
//                         </span>
//                       </td>
//                       <td className="py-3 px-4 text-right">
//                         <button className="text-blue-600 hover:text-blue-800 mr-2">
//                           Review
//                         </button>
//                         <button className="text-gray-600 hover:text-gray-800">
//                           Details
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;