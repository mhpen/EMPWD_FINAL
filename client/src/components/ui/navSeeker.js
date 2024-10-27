import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const NavSeeker = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState(''); // Optional: To store first name
  const token = localStorage.getItem("token"); // Assume you store the token in localStorage

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/seekers', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Pass the token for authentication
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        if (data && data.firstName && data.lastName) {
          setFirstName(data.firstName); // Set first name if needed
          setLastName(data.lastName); // Set last name
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [token]); // Fetch user data when token changes

  return (
    <div >
      <nav className="flex justify-between items-center p-6">
        <div className="flex items-center space-x-4">
          <i className="fas fa-cube text-2xl"></i>
          <span className="ml-4 text-xl font-semibold">LOGO</span>
          <div className="mx-4 border-l border-gray-700 h-6 hidden md:block"></div>
          <div className="hidden md:flex space-x-8 ml-8">
            <Link to="/job-list" className="text-gray-600 hover:text-black">Home</Link>
            <Link to="/job-list" className="text-gray-600 hover:text-black">Explore Jobs</Link>
            <Link to="/explore-companies" className="text-gray-600 hover:text-black">Explore Companies</Link>
            <Link to="/resources" className="text-gray-600 hover:text-black">Resources</Link>
          </div>
        </div>

        {/* Display the fetched user's full name */}
        <div className="hidden md:flex items-center space-x-2 mr-4">
          <span className="text-gray-600 hover:text-black">{`${firstName} ${lastName}` || 'Guest'}</span>
          <div className="w-8 h-8 bg-black rounded-full"></div>
        </div>
        {/* Mobile menu button */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-black focus:outline-none">
            <i className="fas fa-bars text-2xl"></i>
          </button>
        </div>
      </nav>
        <hr className="border-t border-gray-300 mt-0 mr-4 ml-4" />
      {/* Mobile dropdown menu */}
      {isOpen && (
        <div className="md:hidden">
          <nav className="flex flex-col space-y-4 p-4">
            <Link to="/job-list" className="text-gray-600 hover:text-black">Home</Link>
            <Link to="/job-list" className="text-gray-600 hover:text-black">Explore Jobs</Link>
            <Link to="/explore-companies" className="text-gray-600 hover:text-black">Explore Companies</Link>
            <Link to="/resources" className="text-gray-600 hover:text-black">Resources</Link>
            <Link to="/login" className="text-gray-600 hover:text-black">Login</Link>
          </nav>
        </div>
      )}
    </div>
  );
};

export default NavSeeker;
