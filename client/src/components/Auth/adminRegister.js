import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminRegister = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); // Clear previous error

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            await axios.post('/api/admin/', { email, password });
            navigate('/admin/login'); // Redirect to login after registration
        } catch (error) {
            setError('Error registering admin, please try again.');
            console.error('Registration error:', error);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                <h2 className="mb-6 text-2xl font-semibold text-center text-black">Admin Registration</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-800">Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-gray-400"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-800">Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-gray-400"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-800">Confirm Password:</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-gray-400"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 font-semibold text-white bg-black rounded-md hover:bg-gray-800 focus:outline-none focus:ring focus:ring-gray-500"
                    >
                        Register
                    </button>
                </form>
                {error && (
                    <div className="mt-4">
                        <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-md" role="alert">
                            {error}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminRegister;
