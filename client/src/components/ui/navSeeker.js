import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const NavSeeker = () => {
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
    <nav className="flex items-center justify-between p-4">
      <div className="flex items-center">
        <i className="fas fa-cube text-2xl"></i>
        <span className="font-semibold text-lg ml-2">LOGO</span>
        <div className="mx-4 border-l h-6"></div>
        <Link to="/explore-jobs" className="mx-2 text-gray-700">Explore Jobs</Link>
        <Link to="/explore-companies" className="mx-2 text-gray-700">Explore Companies</Link>
        <Link to="/resources" className="mx-2 text-gray-700">Resources</Link>
      </div>

      {/* Display the fetched user's full name */}
      <div className="flex items-center">
        <span className="mr-2 text-gray-700">{`${firstName} ${lastName}` || 'Guest'}</span>
        <div className="w-8 h-8 bg-black rounded-full"></div>
      </div>
    </nav>
  );
};

export default NavSeeker;
