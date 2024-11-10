import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "../ui/alert";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: '', message: '' });
  
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      
      // Only store user data if the login is successful
      if (response.data) {
        setStatus({
          type: 'success',
          message: response.data.message || 'Login successful'
        });
        
        // Store only isVerified status and user ID
        const { userId, role, isVerified } = response.data;
        localStorage.setItem('isVerified', isVerified);
        
        // Handle navigation based on role
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
            
          },
          localStorage.removeItem('userRole'),
          localStorage.removeItem('isVerified'),
          localStorage.removeItem('userId'),)
        }
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'An error occurred. Please try again later.'
      });
      // No need to store anything in local storage on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout', {}, { withCredentials: true });
      localStorage.removeItem('userRole');
      localStorage.removeItem('isVerified');
      localStorage.removeItem('userId');
      console.log("Successfuly logout")
      alert("Successfuly logout")
      navigate('/login'); // Redirect to home or login page
    } catch (error) {
      console.error('Error logging out:', error);
      //setError('Logout failed');
    }
  };

  return (

    <div className="flex items-center justify-center min-h-screen font-poppins h-screen">
      <div className="flex flex-col md:flex-row rounded-lg overflow-hidden max-w-5xl w-full gap-6 p-8">
        <div className="md:w-1/2 p-2">
          <div className="flex items-center mb-8">
            <i className="fas fa-cube text-2xl mr-2"></i>
            <span className="text-[20px] font-semibold">EmpowerPWD</span>
          </div>
          <h2 className="font-semibold text-[26px] tracking-widest">Welcome Back!</h2>
          <p className="text-black mb-8 text-[12px]">Please enter your login details below</p>

          <form onSubmit={handleSubmit}>

            {status.message && (
              <Alert 
                variant={status.type === 'error' ? 'destructive' : 'default'}
                className={status.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : ''}>
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
              <div className="mb-4">
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                className="w-full px-4 py-2 border border-black rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-500 text-[14px]"
                  />
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
              <button 
                onClick={handleLogout} 
                disabled={isLoading} 
                className="mt-2 w-full bg-gray-600 text-white py-2 rounded-3xl font-medium text-[15px]"
              >
                {isLoading ? 'LOGGING OUT...' : 'LOGOUT'}
              </button>
              <div className="ml-6 mt-4 text-[12px]">
                <p className="text-black">
                  Not registered yet?{" "}
                  <Link to="/user-type" className="text-black hover:underline">Create account</Link>
                </p>
              </div>
              <div className="flex items-center ml-6 mt-7 mb-5">
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
                {/* Content here */}
              </div>
          </div>
        </div>
      </div>




    // <div className="flex items-center justify-center min-h-screen bg-gray-100">
    //   <Card className="w-full max-w-md mx-4">
    //     <CardHeader className="space-y-1">
    //       <CardTitle className="text-2xl text-center">Login</CardTitle>
    //     </CardHeader>
    //     <CardContent>
    //       <form onSubmit={handleSubmit} className="space-y-4">
    //         {status.message && (
    //           <Alert 
    //             variant={status.type === 'error' ? 'destructive' : 'default'}
    //             className={status.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : ''}
    //           >
    //             <AlertDescription>{status.message}</AlertDescription>
    //           </Alert>
    //         )}
            
    //         <div className="space-y-2">
    //           <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
    //             Email
    //           </label>
    //           <Input
    //             type="email"
    //             placeholder="Enter your email"
    //             value={email}
    //             onChange={(e) => setEmail(e.target.value)}
    //             required
    //             className="w-full"
    //           />
    //         </div>

    //         <div className="space-y-2">
    //           <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
    //             Password
    //           </label>
    //           <Input
    //             type="password"
    //             placeholder="Enter your password"
    //             value={password}
    //             onChange={(e) => setPassword(e.target.value)}
    //             required
    //             className="w-full"
    //           />
    //         </div>

    //         <Button 
    //           type="submit" 
    //           className="w-full"
    //           disabled={isLoading}
    //         >
    //           {isLoading ? 'Signing in...' : 'Sign In'}
    //         </Button>
    //       </form>
    //     </CardContent>
    //   </Card>
    // </div>
  );
};

export default Login;


/*

<div className="flex items-center justify-center min-h-screen">
  <div className="flex flex-col md:flex-row rounded-lg overflow-hidden max-w-5xl w-full">
    <div className="w-full md:w-1/2 p-8">
      <div className="flex items-center mb-8">
        <i className="fas fa-cube text-2xl mr-2"></i>
        <span className="text-2xl font-semibold">LOGO</span>
      </div>
      <h2 className="text-3xl font-semibold mb-2">Welcome Back!</h2>
      <p className="text-gray-600 mb-8">Please enter your login details below</p>

      {status.message && (
        <Alert 
        variant={status.type === 'error' ? 'destructive' : 'default'}
          className={status.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : ''}>
          <AlertDescription>{status.message}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
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
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ocus:ring-blue-600"
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
            <button 
              type="submit" 
              className="w-full"
              disabled={isLoading} 
              className="w-full bg-black text-white py-2 rounded-3xl font-semibold"
              >
              {isLoading ? 'SIGNING IN...' : 'SIGN IN'}
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

        </div>
      </div>
    </div>
  </div>


*/

