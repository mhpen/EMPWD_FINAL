import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "../ui/alert";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Eye, EyeOff } from 'lucide-react'; // Import icons
import logo from "../../assets/img/logo.svg";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: '', message: '' });
  
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      
      if (response.data) {
        setStatus({
          type: 'success',
          message: response.data.message || 'Login successful'
        });
        
        const { userId, role, isVerified } = response.data;
        localStorage.setItem('isVerified', isVerified);

        if (role === 'jobseeker') {
          localStorage.setItem('userRole', role);
          localStorage.setItem('userId', userId);
          navigate('/job-list');
        } else if (role === 'employer') {
          localStorage.setItem('userRole', role);
          localStorage.setItem('userId', userId);
          navigate('/job-dashboard');
        } else {
          setStatus({
            type: 'error',
            message: 'Unexpected role'
          });
          localStorage.removeItem('userRole');
          localStorage.removeItem('isVerified');
          localStorage.removeItem('userId');
        }
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'An error occurred. Please try again later.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen font-poppins h-screen">
      <div className="flex flex-col md:flex-row rounded-lg overflow-hidden max-w-5xl w-full gap-6 p-8">
        <div className="md:w-1/2 p-2">
          <div className="flex items-center mb-8">
            {<img src={logo} alt="logo" className="w-10 h-10 text-2xl mr-2" /> }
            <span className="text-[20px] font-semibold">EmpowerPWD</span>
          </div>
          <h2 className="font-semibold text-[26px] tracking-widest">Welcome Back!</h2>
          <p className="text-black mb-8 text-[12px]">Please enter your login details below</p>

          <form onSubmit={handleSubmit}>

            {status.message && (
              <Alert 
                variant={status.type === 'error' ? 'destructive' : 'default'}
                className={status.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : ''}
              >
                <AlertDescription>{status.message}</AlertDescription>
              </Alert>
            )}

            <div className="mb-4 mt-2">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-black rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-500 text-[14px]"
              />
            </div>
            <div className="mb-4 relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-black rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-500 text-[14px]"
              />
              <div 
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>
            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center">
                <input type="checkbox" className="form-checkbox accent-black" />
                <span className="ml-2 text-black text-[12px]">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-black hover:underline text-[12px]">Forgot Password?</Link>
            </div>
            <button 
              type="submit" 
              disabled={isLoading} 
              className="w-full bg-black text-white py-2 rounded-3xl font-medium mt-1 text-[15px]"
            >
              {isLoading ? 'SIGNING IN...' : 'SIGN IN'}
            </button>
          </form>
          <div className=" mt-4 text-[12px]">
            <p className="text-black">
              Not registered yet?{" "}
              <Link to="/user-type" className="text-black hover:underline">Create account</Link>
            </p>
          </div>
          <div className="flex items-center  mt-7 mb-5">
            <hr className="flex-grow border-black" />
            <span className="mx-12 text-black text-[12px]">OR</span>
            <hr className="flex-grow border-black" />
          </div>
          <div className="flex justify-center space-x-4">
            <button className="flex items-center justify-center w-20 h-9 border border-black rounded-lg text-[14px]">
              <i className="fas fa-cube mr-2"></i> LOGO
            </button>
            <button className="flex items-center justify-center w-20 h-9 border border-black rounded-lg text-[14px]">
              <i className="fas fa-cube mr-2"></i> LOGO
            </button>
          </div>
        </div>
        <div className="hidden md:flex w-full md:w-1/2 items-center justify-center p-2">
          <div className="w-[480px] h-[500px] bg-[#D9D9D9] flex items-center justify-center rounded-xl">
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
