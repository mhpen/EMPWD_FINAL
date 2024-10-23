import React from 'react';
import { Link } from "react-router-dom";

const Usertype = () => {
  return (
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
  );
};

export default Usertype;
