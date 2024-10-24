import React from 'react';
import { Link } from "react-router-dom";

const NavRegister = ({ navStep }) => {
  const steps = [
    'Basic Info ───',
    'Location Info ───',
    'Disability Info ───',
    'Work Preferences ───',
    'Additional Info ───',
    'Confirmation'
  ];

  return (
   
    <div>
      {/* Header Section */}
      <div className="mt-7 w-full justify-between items-center flex flex-row">
        <div>
          <span className="ml-2 text-xl font-semibold">photo</span>
        </div>

        <div className="flex flex-row" >
          <span className="text-gray-600">Already have an account?</span>
          <Link to="/" className="text-black font-bold ml-3">Login</Link>
        </div>
      </div>

      <div className="w-full p-4 flex flex-col sm:flex-row justify-between items-center">
        
        {/* Progress Bar */}
        <div className="w-full mx-auto p-4">
          <div className="max-w-5xl w-full mx-auto p-4">
            <div className="flex flex-wrap items-center justify-between mb-4">
              {steps.map((step, index) => {
                const isCompleted = index + 1 < navStep;
                const isActive = index + 1 === navStep;

                return (
                  <div key={index} className="flex items-center mb-2 sm:mb-0">
                    {/* Circle */}
                    <div
                      className={`w-6 h-6 border-2 rounded-full flex items-center justify-center 
                        ${isCompleted ? 'border-gray-400' : isActive ? 'border-black' : 'border-gray-400'}
                      `}
                    >
                      <span
                        className={`text-sm 
                          ${isCompleted ? 'text-gray-500' : isActive ? 'text-black' : 'text-gray-400'}
                        `}
                      >
                        {index + 1}
                      </span>
                    </div>

                    {/* Step Name */}
                    <span
                      className={`ml-2 text-sm 
                        ${isCompleted ? 'text-gray-400 semi-bold' : isActive ? 'text-black' : 'text-gray-400'}
                      `}
                    >
                      {step}
                    </span>

                    {/* Line Between Steps */}
                    {index < steps.length - 1 && (
                      <div
                        className={`flex-grow border-t 
                          ${isCompleted ? 'border-green-500' : isActive ? 'border-black' : 'border-gray-300'}
                          mx-2 hidden sm:block`}
                      ></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavRegister;