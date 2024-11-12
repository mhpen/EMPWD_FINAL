import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavEmployer from '../ui/navEmployer';

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
    const fullName = `${app.jobseeker?.firstName || ''} ${app.jobseeker?.lastName || ''}`;
    const jobTitle = app.jobId?.jobTitle || '';
    return (
      fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      jobTitle.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });
  return (
    <div className="flex h-screen">
      <NavEmployer />
      <div className="flex-1 p-8 bg-white pt-12 p-4 sm:ml-64">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Applications</h1>
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Search applications..."
              className="border rounded-lg px-4 py-2"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </header>

        {/* Your existing table content */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
          <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position Applied</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Application ID</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Disability Type</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profile</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredApplications.map(app => (
                    <tr key={app._id} className="hover:bg-gray-50 transition duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {app.jobseeker?.firstName} {app.jobseeker?.lastName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{app.jobId?.jobTitle}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{app._id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{app.disabilityType}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <a href={app.profileLink} className="text-blue-600 hover:text-blue-800 font-medium">View Profile</a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          app.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          app.status === 'Approved' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button className="text-blue-600 hover:text-blue-900 p-1" title="View">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button className="text-yellow-600 hover:text-yellow-900 p-1" title="Edit">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button className="text-gray-600 hover:text-gray-900 p-1" title="More">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
          </table>
        </div>
      </div>
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