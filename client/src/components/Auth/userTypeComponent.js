import React from 'react';
import { Link } from "react-router-dom";

const Usertype = () => {
  return (
    <div className="bg-white flex flex-col items-center justify-center min-h-screen">

      {/* Top Left Logo */}
      <div className="absolute top-0 left-6 m-8 flex items-center">
        <i className="fas fa-camera-retro text-2xl"></i>
        <span className="ml-2 text-xl font-bold">photo</span>
      </div>

      {/* Top Right Login Section */}
      <div className="absolute top-0 right-10 m-8">
        <span className="text-gray-500">Already have account?</span>
        <Link to="/login" className="text-black font-bold ml-2">Login</Link>
      </div>

      {/* Welcome Section */}
      <div className="text-center">
        <h1 className="text-gray-700 text-2xl font-bold">Welcome! How Would You Like to Join?</h1>
        <p className="text-gray-500 mt-2">Choose your role to start the registration process.</p>
      </div>

      {/* Role Selection Section */}
      <div className="flex mt-10 space-x-20">

        {/* I'm Hiring Section */}
        <div className="text-center">
          <p className="mb-4">I'm Hiring</p>
          <div className="w-48 h-48 bg-[#E5E5E5] flex items-center justify-center rounded-lg">
            </div>
              <Link to="/create-employer"> 
              <button className="mt-4 bg-black text-white py-2 px-4 rounded-full">
                Employer
              </button>
            </Link>
          </div>

        {/* I'm Looking for a Job Section */}
        <div className="text-center">
          <p className="mb-4">I'm Looking for a Job</p>
          <div className="w-48 h-48 bg-[#E5E5E5] flex items-center justify-center rounded-lg">
          </div>
          <Link to="/RegisterjobSeeker">
            <button className="mt-4 bg-black text-white py-2 px-4 rounded-full">  
              Job Seeker
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Usertype;

