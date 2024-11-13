import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeft, 
  Building2, 
  MapPin, 
  Calendar, 
  Briefcase, 
  Clock, 
  DollarSign,
  Users,
  CheckCircle,
  XCircle 
} from 'lucide-react';
import NavEmployer from '../ui/navEmployer';

const JobReview = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [declineReason, setDeclineReason] = useState('');
  const [showDeclineModal, setShowDeclineModal] = useState(false);

  useEffect(() => {
    fetchJobDetails();
  }, [jobId]);

  const fetchJobDetails = async () => {
    try {
      const response = await axios.get(`/api/admin/management/jobs/${jobId}`);
      setJob(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching job details');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      const response = await axios.patch(`/api/admin/management/jobs/${jobId}/status`, {
        status: 'active',
        message: 'Your job posting has been approved and is now live.'
      });
      
      if (response.data.success) {
        console.log('Job successfully approved:', response.data);
        navigate('/admin/jobs');
      } else {
        throw new Error(response.data.message);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      console.error('Error updating job:', errorMessage);
      setError(errorMessage);
      alert(`Failed to approve job: ${errorMessage}`);
    }
  };

  const handleDecline = async () => {
    try {
      const response = await axios.patch(`/api/admin/management/jobs/${jobId}/status`, {
        status: 'declined',
        message: declineReason || 'Your job posting has been declined.'
      });
      
      if (response.data.success) {
        console.log('Job successfully declined:', response.data);
        setShowDeclineModal(false);
        navigate('/admin/jobs');
      } else {
        throw new Error(response.data.message);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      console.error('Error declining job:', errorMessage);
      setError(errorMessage);
      alert(`Failed to decline job: ${errorMessage}`);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!job) return <div>Job not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 font-poppins">
      <NavEmployer />
      
      <div className="p-4 sm:ml-64">
        {/* Breadcrumb */}
        <nav className="mb-6 text-gray-600">
          <ol className="flex items-center space-x-2">
            <li>
              <button
                onClick={() => navigate('/admin/jobs')}
                className="flex items-center hover:text-black transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Jobs
              </button>
            </li>
          </ol>
        </nav>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Status Badge */}
          <div className="bg-white rounded-2xl shadow-sm p-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Job Review</h1>
            <span className={`px-4 py-2 rounded-full text-sm font-medium
              ${job?.jobStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                job?.jobStatus === 'active' ? 'bg-green-100 text-green-800' :
                'bg-red-100 text-red-800'}`}>
              {job?.jobStatus?.charAt(0).toUpperCase() + job?.jobStatus?.slice(1)}
            </span>
          </div>

          {/* Job Details Card */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{job?.jobTitle}</h2>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <Building2 className="w-5 h-5 mr-3" />
                    <span>{job?.employersId.companyName}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-5 h-5 mr-3" />
                    <span>{job?.jobLocation}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Briefcase className="w-5 h-5 mr-3" />
                    <span>{job?.employmentType}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-5 h-5 mr-3" />
                    <span>Deadline: {new Date(job?.applicationDeadline).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <DollarSign className="w-5 h-5 mr-3" />
                    <span>Salary: {job?.salary || 'Not specified'}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="w-5 h-5 mr-3" />
                    <span>Positions: {job?.numberOfVacancies}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h3 className="font-semibold text-gray-900 mb-2">Quick Info</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Posted On</p>
                      <p className="font-medium">{new Date(job?.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Experience</p>
                      <p className="font-medium">{job?.experienceLevel}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description Sections */}
            <div className="mt-8 space-y-6">
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Job Description</h3>
                <p className="text-gray-600 whitespace-pre-line">{job?.jobDescription}</p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Accessibility Features</h3>
                <div className="grid grid-cols-2 gap-2">
                  {job?.accessibilityFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center text-gray-600">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                      {feature}
                    </div>
                  ))}
                </div>
              </section>

              {job?.specialAccommodations && (
                <section>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Special Accommodations</h3>
                  <p className="text-gray-600">{job.specialAccommodations}</p>
                </section>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex gap-4">
              <button
                onClick={handleApprove}
                className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors flex items-center"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Approve Job
              </button>
              <button
                onClick={() => setShowDeclineModal(true)}
                className="px-6 py-3 bg-white text-red-600 border border-red-600 rounded-xl hover:bg-red-50 transition-colors flex items-center"
              >
                <XCircle className="w-5 h-5 mr-2" />
                Decline Job
              </button>
            </div>
          </div>
        </div>

        {/* Decline Modal - Updated styling */}
        {showDeclineModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md m-4">
              <h2 className="text-xl font-semibold mb-4">Decline Job</h2>
              <textarea
                className="w-full p-4 border rounded-xl mb-6 h-32 resize-none focus:ring-2 focus:ring-gray-200 focus:border-gray-300 transition-all"
                placeholder="Please provide a reason for declining this job posting..."
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
              />
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowDeclineModal(false)}
                  className="px-6 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDecline}
                  className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                >
                  Confirm Decline
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobReview; 