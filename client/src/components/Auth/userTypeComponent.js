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
      <a href="#" className="text-black font-bold ml-2">Login</a>
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
        
        <Link className="mt-4 bg-black text-white py-2 px-4 rounded-full">
          Employer
        </Link>
      </div>

      {/* I'm Looking for a Job Section */}
      <div className="text-center">
        <p className="mb-4">I'm Looking for a Job</p>
        <div className="w-48 h-48 bg-[#E5E5E5] flex items-center justify-center rounded-lg">
        </div>
        <Link className="mt-4 bg-black text-white py-2 px-4 rounded-full">
          Job Seeker
        </Link>
      </div>
    </div>
  </div>
  );
};

export default Usertype;


/*
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white p-8 rounded-md shadow-lg w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold">Welcome! How Would You Like to Join?</h1>
          <p className="text-gray-600 mt-2">Choose your role to start the registration process.</p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Employer Block */}
          <div className="text-center">
            <div className="w-full h-32 bg-gray-300 flex justify-center items-center rounded-md mb-4">
              {/* Placeholder for the employer image */}
              <span className="text-gray-500">Image</span>
            </div>
            <Link to="/create-employer"> 
              <button className="bg-black text-white py-2 px-4 rounded-md">Employer</button>
            </Link>
          </div>

          {/* Job Seeker Block */}
          <div className="text-center">
            <div className="w-full h-32 bg-gray-300 flex justify-center items-center rounded-md mb-4">
              {/* Placeholder for the job seeker image */}
              <span className="text-gray-500">Image</span>
            </div>
            <Link to="/RegisterjobSeeker">
              <button className="bg-black text-white py-2 px-4 rounded-md">Job Seeker</button>
            </Link>
          </div>
        </div>

        <div className="text-right mt-4">
          <Link to="/login" className="text-gray-500 hover:text-black">Already have an account? Login</Link>
        </div>
      </div>
    </div>



*/
