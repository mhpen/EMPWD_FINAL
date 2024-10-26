import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistance } from 'date-fns';

const JobCard = ({ job }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        {job.jobTitle}
      </h2>
      <p className="text-gray-600 mb-2">{job.employersId?.companyName}</p>
      <div className="mb-4">
        <p className="text-gray-500">📍 {job.jobLocation}</p>
        <p className="text-gray-500">💼 {job.employmentType}</p>
        <p className="text-gray-500">
          💰 ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()} /year
        </p>
      </div>
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {job.keySkills.slice(0, 3).map((skill, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">
          Posted {formatDistance(new Date(job.createdAt), new Date(), { addSuffix: true })}
        </span>
        <Link
          to={`/jobs/${job._id}`}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default JobCard;