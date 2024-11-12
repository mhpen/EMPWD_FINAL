import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription } from "../ui/alert"; // Importing Alert components

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState({ type: '', message: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: '', message: '' }); // Clear previous status

        try {
            const response = await axios.post('/api/admin/login', { email, password });

            // Store userId and role in localStorage
            localStorage.setItem('userId', response.data.userId);
            localStorage.setItem('userRole', response.data.role);

            setStatus({
                type: 'success',
                message: response.data.message || 'Login successful',
            });

            navigate('/admin/dashboard'); // Redirect to admin dashboard
        } catch (error) {
            setStatus({
                type: 'error',
                message: error.response?.data?.message || 'Invalid credentials, please try again.',
            });
            console.error('Login error:', error);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-center">Admin Login</h2>
                {status.message && (
                    <Alert 
                        variant={status.type === 'error' ? 'destructive' : 'default'}
                        className={status.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                    >
                        <AlertDescription>{status.message}</AlertDescription>
                    </Alert>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="mb-4">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold"
                    >
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;