import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const res = await axios.post('/api/auth/login', formData, {
        withCredentials: true
      });
      
      const { userId, role, message } = res.data;
      localStorage.setItem('userRole', role);
      setSuccess(message);
      
      if (role === 'jobseeker') {
        navigate('/job-list')
        //navigate('/job-application');
      } else if (role === 'employer') {
        navigate('/job-dashboard');
        console.log(userId);      } else {
        setError('Unexpected role');
      }

    } catch (error) {
      console.error('Error logging user:', error);
      const errorMessage = error.response?.data?.message || 'Login failed';
      setError(errorMessage);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout', {}, { withCredentials: true });
      localStorage.removeItem('userRole');
      setSuccess('Logout successful');
      navigate('/'); // Redirect to home or login page
    } catch (error) {
      console.error('Error logging out:', error);
      setError('Logout failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col md:flex-row rounded-lg overflow-hidden max-w-5xl w-full">
        <div className="w-full md:w-1/2 p-8">
          <div className="flex items-center mb-8">
            <i className="fas fa-cube text-2xl mr-2"></i>
            <span className="text-2xl font-semibold">LOGO</span>
          </div>
          <h2 className="text-3xl font-semibold mb-2">Welcome Back!</h2>
          <p className="text-gray-600 mb-8">Please enter your login details below</p>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>
            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center">
                <input type="checkbox" className="form-checkbox" />
                <span className="ml-2 text-gray-600">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-blue-600">Forgot Password?</Link>
            </div>
            <button type="submit" className="w-full bg-black text-white py-2 rounded-3xl font-semibold">
              SIGN IN
            </button>
          </form>
          <button onClick={handleLogout} className="mt-4 w-full bg-red-600 text-white py-2 rounded-3xl font-semibold">
            LOGOUT
          </button>
          <div className="text-center mt-6">
            <p className="text-gray-600">
              Not registered yet?{" "}
              <Link to="/user-type" className="text-blue-600">Create account</Link>
            </p>
          </div>
          <div className="flex items-center my-6">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-2 text-gray-400">OR</span>
            <hr className="flex-grow border-gray-300" />
          </div>
          <div className="flex justify-center space-x-4">
            <button className="flex items-center justify-center w-20 h-10 border rounded-lg">
              <i className="fas fa-cube mr-2"></i> LOGO
            </button>
            <button className="flex items-center justify-center w-20 h-10 border rounded-lg">
              <i className="fas fa-cube mr-2"></i> LOGO
            </button>
          </div>
        </div>
        
        <div className="w-full md:w-1/2 flex items-center justify-center">
          <div className="w-3/4 h-3/4 bg-[#D9D9D9] flex items-center justify-center rounded-xl">
            {/* Image Placeholder */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;