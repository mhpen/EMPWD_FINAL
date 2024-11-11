import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ApplicationPanel = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const userId = localStorage.getItem('userId'); // Get userId from local storage
                const response = await axios.get(`/api/applications?userId=${userId}`, {
                    withCredentials: true // Include cookies with the request
                });
                setApplications(response.data);
            } catch (err) {
                setError(err.response.data.message || 'Error fetching applications');
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>Applications</h1>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Job Title</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {applications.map(app => (
                        <tr key={app._id}>
                            <td>{app.basicInfo.firstName} {app.basicInfo.lastName}</td>
                            <td>{app.basicInfo.email}</td>
                            <td>{app.basicInfo.phoneNumber}</td>
                            <td>{app.jobId.jobTitle}</td> {/* Assuming jobId is populated */}
                            <td>{app.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ApplicationPanel;