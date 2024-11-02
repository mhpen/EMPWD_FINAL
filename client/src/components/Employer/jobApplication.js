import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ApplicationDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) {
      console.error("User ID not found in localStorage");
      return;
    }

    const fetchApplications = async () => {
      try {
        const response = await axios.get(`/api/applications/employer/${userId}/applications`);
        setApplications(response.data.data);
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };

    fetchApplications();
  }, [userId]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredApplications = applications.filter(app => {
    const fullName = `${app.jobseeker?.firstName} ${app.jobseeker?.lastName}`;
    const jobTitle = app.jobId?.jobTitle;
    return (
      fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      jobTitle.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Job Applications</h2>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            className="w-64 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search by name or job title"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Add Candidate
          </button>
        </div>
      </div>
      <table className="w-full bg-white border border-gray-300 rounded-lg">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 border-b">Full Name</th>
            <th className="py-2 px-4 border-b">Position Applied</th>
            <th className="py-2 px-4 border-b">Application ID</th>
            <th className="py-2 px-4 border-b">Disability Type</th>
            <th className="py-2 px-4 border-b">Profile Link</th>
            <th className="py-2 px-4 border-b">Application Status</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredApplications.map(app => (
            <tr key={app._id} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b">{app.jobseeker?.firstName} {app.jobseeker?.lastName}</td>
              <td className="py-2 px-4 border-b">{app.jobId?.jobTitle}</td>
              <td className="py-2 px-4 border-b">{app._id}</td>
              <td className="py-2 px-4 border-b">{app.disabilityType}</td>
              <td className="py-2 px-4 border-b">
                <a href={app.profileLink} className="text-blue-500 hover:underline">
                  View
                </a>
              </td>
              <td className="py-2 px-4 border-b">{app.status}</td>
              <td className="py-2 px-4 border-b flex justify-end space-x-2">
                <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                  View
                </button>
                <button className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">
                  Edit
                </button>
                <button className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Define actions for view, edit, delete
const viewApplication = (id) => {
  console.log("Viewing application", id);
};

const editApplication = (id) => {
  console.log("Editing application", id);
};

const deleteApplication = (id) => {
  console.log("Deleting application", id);
};

export default ApplicationDashboard;