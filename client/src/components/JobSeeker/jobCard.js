import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistance } from 'date-fns';

const JobCard = ({ job }) => {
  // Check if job._id is defined and a valid string
  const jobId = job._id ? job._id.toString() : '';

  return (
    <div className="bg-white p-4 rounded shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        {job.jobTitle}
      </h2>
      <p className="text-gray-600 mb-2">{job.employersId?.companyName || 'Unknown Company'}</p>
      <div className="mb-4">
        <p className="text-gray-500">📍 {job.jobLocation || 'Location not specified'}</p>
        <p className="text-gray-500">💼 {job.employmentType || 'Employment type not specified'}</p>
        <p className="text-gray-500">
          💰 ${job.salaryMin?.toLocaleString() || 'N/A'} - ${job.salaryMax?.toLocaleString() || 'N/A'} /year
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
          to={`/jobs/${jobId}`}
          className="bg-black text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default JobCard;
