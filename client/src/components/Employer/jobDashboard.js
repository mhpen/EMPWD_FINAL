import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';
import 'tailwindcss/tailwind.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const JobsDashboard = () => {
    const [jobPostings, setJobPostings] = useState([]);
    const [menuOpen, setMenuOpen] = useState(null); // Store currently selected job index
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        const fetchJobPostings = async () => {
            try {
                const response = await axios.get('/api/job-postings'); // Adjust the endpoint as needed
                setJobPostings(response.data);
            } catch (error) {
                console.error('Error fetching job postings:', error);
            }
        };

        fetchJobPostings();
    }, []);

    const toggleMenu = (index) => {
        // Toggle the menu for the clicked job
        setMenuOpen(menuOpen === index ? null : index);
    };

    const handleOptionClick = async (action) => {
        if (action === 'view') {
            console.log('View job:', jobPostings[menuOpen]);
        } else if (action === 'edit') {
            console.log('Edit job:', jobPostings[menuOpen]);
        } else if (action === 'delete') {
            const jobId = jobPostings[menuOpen]._id; // Adjust based on your data structure
            const confirmDelete = window.confirm('Are you sure you want to delete this job posting?');
            if (confirmDelete) {
                await deleteJob(jobId);
            }
        }
        // Close the menu after action
        setMenuOpen(null);
    };

    const deleteJob = async (id) => {
        try {
            await axios.delete(`/api/delete-job/${id}`); // Update the endpoint if necessary
            setJobPostings(jobPostings.filter(job => job._id !== id)); // Update local state
        } catch (error) {
            console.error('Error deleting job:', error);
        }
    };

    return (
        <div className="flex flex-col md:flex-row h-screen">
            <aside className={`w-full md:w-1/5 bg-white border-r border-gray-300 p-4 ${menuOpen ? 'block' : 'hidden'} md:block`}>
                <div className="absolute top-0 left-0 m-4">
                    <i className="fas fa-cube text-2xl"></i>
                    <span className="ml-2 text-xl font-semibold">photo</span>
                </div>
                <nav className="mt-16">
                    <ul>
                        <li className="mb-4"><a href="#" className="text-black">Dashboard Overview</a></li>
                        <hr className="border-gray-300 mb-4" />
                        <li className="mb-4"><a href="#" className="text-black">Job Management</a></li>
                        <hr className="border-gray-300 mb-4" />
                        <li className="mb-4"><a href="#" className="text-black">User Management</a></li>
                        <hr className="border-gray-300 mb-4" />
                    </ul>
                </nav>
            </aside>
            <main className="flex-1 p-4 md:p-8">
                <header className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                        <button className="md:hidden text-black" onClick={() => setMenuOpen(!menuOpen)}>
                            <i className="fas fa-bars"></i>
                        </button>
                        <div className="flex items-center space-x-4 md:ml-auto">
                            <a href="#" className="text-black hidden md:block">Notifications</a>
                            <a href="#" className="text-black hidden md:block">Settings</a>
                            <a href="#" className="text-black md:hidden"><i className="fas fa-bell"></i></a>
                            <a href="#" className="text-black md:hidden"><i className="fas fa-cog"></i></a>
                            <div className="flex items-center">
                                <span className="text-black mr-2">Roberto</span>
                                <div className="w-8 h-8 bg-black rounded-full"></div>
                            </div>
                        </div>
                    </div>
                    <hr className="border-gray-300 mb-4" />
                </header>
                <div className="p-4 md:p-8">
                    <div className="flex justify-between items-center mb-2">
                        <h1 className="text-2xl md:text-3xl font-bold">Job Management System</h1>
                        <button 
                            className="bg-black text-white px-2 py-1 md:px-4 md:py-2 text-xs md:text-base" 
                            onClick={() => navigate('/create-job')} // Navigate to Add Job page
                        >
                            Add Job
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-xs md:text-base">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border-b border-gray-300 px-2 py-1 md:px-4 md:py-2 text-left">Job Title</th>
                                    <th className="border-b border-gray-300 px-2 py-1 md:px-4 md:py-2 text-left">Industry</th>
                                    <th className="border-b border-gray-300 px-2 py-1 md:px-4 md:py-2 text-left">Date</th>
                                    <th className="border-b border-gray-300 px-2 py-1 md:px-4 md:py-2 text-left">Job Status</th>
                                    <th className="border-b border-gray-300 px-2 py-1 md:px-4 md:py-2 text-left"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {jobPostings.map((job, index) => (
                                    <tr key={job._id}> {/* Use a unique identifier for the key */}
                                        <td className="border-b border-gray-300 px-2 py-1 md:px-4 md:py-2">{job.jobTitle}</td>
                                        <td className="border-b border-gray-300 px-2 py-1 md:px-4 md:py-2">{job.industry}</td>
                                        <td className="border-b border-gray-300 px-2 py-1 md:px-4 md:py-2">{new Date(job.createdAt).toLocaleDateString()}</td>
                                        <td className="border-b border-gray-300 px-2 py-1 md:px-4 md:py-2">
                                            <button className="border border-black px-2 py-1 md:px-4 md:py-2 text-xs md:text-base">Review</button>
                                        </td>
                                        <td className="border-b border-gray-300 px-2 py-1 md:px-4 md:py-2 text-center">
                                            <button onClick={() => toggleMenu(index)} className="text-black">
                                                <i className="fas fa-ellipsis-v"></i>
                                            </button>
                                            {menuOpen === index && (
                                                <div className="absolute bg-white border border-gray-300 p-2 rounded-md shadow-md">
                                                    <button onClick={() => handleOptionClick('view')} className="block text-left text-black">View</button>
                                                    <button onClick={() => handleOptionClick('edit')} className="block text-left text-black">Edit</button>
                                                    <button onClick={() => handleOptionClick('delete')} className="block text-left text-red-500">Delete</button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default JobsDashboard;
