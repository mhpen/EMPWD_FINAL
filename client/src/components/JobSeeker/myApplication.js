import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { MoreVertical, Calendar as CalendarIcon, ChevronDown, Filter } from 'lucide-react';
import axios from 'axios';
import NavSeeker from '../ui/navSeeker';
import MessageModal from '../messages/MessageModal';


const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

const StatusIndicator = ({ status }) => {
  // Default status styles to handle undefined/unknown status
  const defaultStyle = {
    bg: 'bg-gray-50',
    text: 'text-gray-700',
    border: 'border-black',
    dot: 'bg-gray-400'
  };

  const statusStyles = {
    'Pending': {
      bg: 'bg-yellow-50',
      text: 'text-yellow-700',
      border: 'border-yellow-200',
      dot: 'bg-yellow-400'
    },
    'Interview Scheduled': {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      dot: 'bg-emerald-400'
    },
    'Rejected': {
      bg: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200',
      dot: 'bg-red-400'
    },
    'Accepted': {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      dot: 'bg-blue-400'
    }
  };

  // Use the style for the given status, or fall back to default style
  const style = statusStyles[status] || defaultStyle;

  // Normalize the display status
  const displayStatus = status || 'Unknown';

  return (
    <div className={`px-4 py-2 rounded-full border ${style.bg} ${style.border}`}>
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${style.dot}`} />
        <span className={`text-sm font-medium ${style.text}`}>{displayStatus}</span>
      </div>
    </div>
  );
};

const ApplicationCard = ({ application, onActionSelect }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm overflow-visible hover:shadow-md transition-shadow relative border border-black">
        <div className="p-4 flex items-center gap-6">
          {/* Section 1: Company Logo */}
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center">
              {application.company.logo ? (
                <img 
                  src={application.company.logo} 
                  alt={application.company.name}
                  className="w-full h-full object-contain rounded-xl"
                />
              ) : (
                <span className="text-2xl font-medium text-gray-500">
                  {application.company.name.charAt(0)}
                </span>
              )}
            </div>
          </div>

          {/* Section 2: Job Info */}
          <div className="flex-grow">
            <h3 className="text-lg font-semibold text-gray-800">
              {application.job.title}
            </h3>
            <p className="text-gray-600">{application.company.name}</p>
            <div className="mt-2 flex flex-wrap gap-3 text-sm">
              <span className="text-gray-500">{application.job.location}</span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-500">{application.job.employmentType}</span>
              {(application.job.salary.min > 0 || application.job.salary.max > 0) && (
                <>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-500">
                    ${application.job.salary.min.toLocaleString()} - ${application.job.salary.max.toLocaleString()}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Section 3: Status */}
          <div className="flex-shrink-0">
            <StatusIndicator status={application.status} />
          </div>

          {/* Section 4: Actions with fixed positioning */}
          <div className="flex-shrink-0">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors relative"
            >
              <MoreVertical size={20} className="text-gray-400" />
            </button>
            {showDropdown && (
              <>
                <div 
                  className="fixed inset-0 z-40"
                  onClick={() => setShowDropdown(false)}
                />
                <div 
                  className="absolute right-0 w-48 bg-white rounded-xl shadow-lg py-1 z-50"
                  style={{
                    top: 'calc(0% + 0.4rem)',
                    right: '-11rem',
                  }}
                >
                  <button 
                    onClick={() => {
                      onActionSelect('view', application.applicationId);
                      setShowDropdown(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                  >
                    View Details
                  </button>
                  <button 
                    onClick={() => {
                      setShowMessageModal(true);
                      setShowDropdown(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Message Recruiter
                  </button>
                  <button 
                    onClick={() => {
                      onActionSelect('delete', application.applicationId);
                      setShowDropdown(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50"
                  >
                    Delete Application
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <MessageModal
        isOpen={showMessageModal}
        onClose={() => setShowMessageModal(false)}
        employerId={application.job.employerId}
        jobTitle={application.job.title}
        companyName={application.company.name}
      />
    </>
  );
};

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  const fetchApplications = async () => {
    try {
      const response = await axios.get('/api/seekers/applications');
      
      const fetchedApplications = response.data.applications.map(app => ({
        applicationId: app._id || '',
        status: app.status || 'Pending',
        appliedAt: new Date(app.createdAt || new Date()),
        job: {
          id: app.jobId?._id || '',
          title: app.jobId?.jobTitle || 'Untitled Position',
          location: app.jobId?.jobLocation || 'Location not specified',
          employmentType: app.jobId?.employmentType || 'Not specified',
          employerId: app.jobId?.employersId?._id || '',
          salary: {
            min: app.jobId?.salaryMin || 0,
            max: app.jobId?.salaryMax || 0
          },
          status: app.jobId?.jobStatus || 'Active'
        },
        company: {
          name: app.jobId?.employersId?.companyInfo?.companyName || 'Company Name Not Available',
          logo: app.jobId?.employersId?.companyInfo?.companyLogo || null,
          website: app.jobId?.employersId?.companyInfo?.website || '',
          description: app.jobId?.employersId?.companyInfo?.companyDescription || '',
          industry: app.jobId?.employersId?.companyInfo?.industry || ''
        }
      }));

      const interviewAppointments = fetchedApplications
        .filter(app => app.status === 'Interview Scheduled')
        .map(app => ({
          date: new Date(app.appliedAt),
          title: app.job.title,
          company: app.company.name,
          type: 'Interview'
        }));

      setAppointments(interviewAppointments);
      setApplications(fetchedApplications);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching application details:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  

  const handleSort = (applications) => {
    return [...applications].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.appliedAt) - new Date(b.appliedAt);
          break;
        case 'company':
          comparison = a.company.name.localeCompare(b.company.name);
          break;
        case 'title':
          comparison = a.job.title.localeCompare(b.job.title);
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  };

  const handleFilter = (applications) => {
    return applications.filter(app => {
      const matchesSearch = (
        app.job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.company.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      const matchesStatus = filterStatus === 'All' || app.status === filterStatus;
      
      return matchesSearch && matchesStatus;
    });
  };

  const renderCalendar = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    return (
      <div className="p-3">
        <div className="flex justify-between items-center mb-3 px-2">
          <button onClick={() => setSelectedDate(new Date(year, month - 1))} 
            className="text-gray-600 hover:text-gray-800 p-2 hover:bg-gray-100 rounded-xl transition-colors">
            ←
          </button>
          <h3 className="text-sm font-medium">{monthNames[month]} {year}</h3>
          <button onClick={() => setSelectedDate(new Date(year, month + 1))} 
            className="text-gray-600 hover:text-gray-800 p-2 hover:bg-gray-100 rounded-xl transition-colors">
            →
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-1 text-xs">
          {days.map(day => (
            <div key={day} className="text-center text-gray-500 font-medium p-1">
              {day}
            </div>
          ))}
          {Array.from({ length: 35 }).map((_, i) => {
            const day = i - getFirstDayOfMonth(year, month) + 1;
            const isCurrentMonth = day > 0 && day <= getDaysInMonth(year, month);
            const isToday = new Date(year, month, day).toDateString() === new Date().toDateString();
            
            return (
              <div
                key={i}
                className={`h-7 flex items-center justify-center text-xs rounded-xl
                  ${isCurrentMonth ? 'cursor-pointer hover:bg-gray-100' : 'text-gray-300'}
                  ${isToday ? 'bg-gray-100 font-bold' : ''}
                `}
              >
                {isCurrentMonth ? day : ''}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const handleAction = async (action, applicationId) => {
    switch (action) {
      case 'view':
        // Implement view details logic
        break;
      case 'message':
        // Implement message recruiter logic
        break;
      case 'delete':
        try {
          await axios.delete(`/api/seekers/applications/${applicationId}`);
          fetchApplications();
        } catch (error) {
          console.error('Error deleting application:', error);
        }
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
        <NavSeeker/>
        <hr className="border-t border-gray-300 mt-0" />
      <div className="max-w-7xl mx-auto p-6 space-y-6 font-poppins">
    
        <div className="bg-white rounded-xl shadow-sm p-6  border border-black">
          <h1 className="text-2xl font-bold text-gray-800">My Applications</h1>
        </div>
      
        <div className="grid grid-cols-3 gap-6">

          {/* Main Content - left Side */}
          <div className="col-span-2 space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 ">
              <div className="bg-white rounded-xl shadow-sm p-6 text-center border border-black">
                
                <p className="text-sm text-gray-500">Total Applications</p>
                <div className="w-full h-px bg-gray-100 my-3" />
                <p className="text-2xl font-bold text-gray-800">{applications.length}</p>
              </div>
              {Object.entries({
                'Pending': 'bg-yellow-400',
                'Interview Scheduled': 'bg-emerald-400',
                'Accepted': 'bg-blue-400'
              }).map(([status, color]) => (
                <div key={status} className="bg-white rounded-xl shadow-sm p-6 text-center border border-black">
                  <div className="flex items-center justify-center gap-2  ">
                    <div className={`w-2 h-2 rounded-full ${color}`} />
                    <p className="text-sm text-gray-500">{status}</p>
                  </div>
                  <div className="w-full h-px bg-gray-100 my-3 " />
                  <p className="text-2xl font-bold text-gray-800 ">
                    {applications.filter(app => app.status === status).length}
                  </p>
                </div>
              ))}
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-sm p-4  border border-black">
              <div className="flex gap-4  ">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search applications..."
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 focus:outline-none focus:bg-gray-100 transition-colors border border-black"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="relative  ">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="px-4 py-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors flex items-center gap-2 border border-black"
                  >
                    <Filter size={20} />
                    <span>Filters</span>
                  </button>{showFilters && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg p-4 z-20">
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Sort by</label>
                          <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          >
                            <option value="date">Date Applied</option>
                            <option value="company">Company Name</option>
                            <option value="title">Job Title</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Order</label>
                          <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          >
                            <option value="desc">Newest First</option>
                            <option value="asc">Oldest First</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Status</label>
                          <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border"
                          >
                            <option value="All">All Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Interview Scheduled">Interview Scheduled</option>
                            <option value="Accepted">Accepted</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Applications List */}
            <div className="space-y-4  ">
              {loading ? (
                <div className="bg-white rounded-2xl shadow-sm p-6 text-center text-gray-500 ">
                  Loading applications...
                </div>
              ) : applications.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm p-6 text-center text-gray-500">
                  No applications found.
                </div>
              ) : (
                handleSort(handleFilter(applications)).map((application) => (
                  <ApplicationCard
                    key={application.applicationId}
                    application={application}
                    onActionSelect={handleAction}
                  />
                ))
              )}
            </div>
          </div>
          {/* Calendar and Appointments - right Side */}
          <div className="space-y-4 ">
            <div className="bg-white rounded-xl shadow-sm border border-black">

              {renderCalendar()}
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6 border border-black">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-800">
                    Appointments for {selectedDate.toLocaleDateString()}
                  </h3>
                  <CalendarIcon className="w-4 h-4 text-gray-400" />
                </div>
                {appointments.length === 0 ? (
                  <p className="text-sm text-gray-500">No appointments scheduled</p>
                ) : (
                  appointments.map((apt, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="font-medium text-gray-800">{apt.company}</div>
                      <div className="text-sm text-gray-600">{apt.title}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {apt.date.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MyApplications;
                  