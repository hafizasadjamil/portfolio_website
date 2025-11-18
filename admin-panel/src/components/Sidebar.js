import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTachometerAlt, FaProjectDiagram, FaTools, FaTrophy, FaGraduationCap, FaBlog, FaEnvelope, FaUser, FaSignOutAlt, FaBars, FaTimes, FaCode} from 'react-icons/fa';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const menuItems = [
    { path: '/dashboard', icon: <FaTachometerAlt />, label: 'Dashboard' },
    { path: '/projects', icon: <FaProjectDiagram />, label: 'Projects' },
    { path: '/skills', icon: <FaTools />, label: 'Skills' },
    { path: '/achievements', icon: <FaTrophy />, label: 'Achievements' },
    { path: '/education', icon: <FaGraduationCap />, label: 'Education' },
    { path: '/blog', icon: <FaBlog />, label: 'Blog' },
    { path: '/messages', icon: <FaEnvelope />, label: 'Messages' },
    { path: '/profile', icon: <FaUser />, label: 'Profile' },
    { path: '/course-certifications', icon: <FaGraduationCap />, label: 'Courses' },
    { path: '/leetcode-progress', icon: <FaCode />, label: 'LeetCode' },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-gray-800 text-white p-2 rounded-md"
        >
          {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`bg-gray-800 text-white w-64 min-h-screen fixed md:relative z-40 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold">Admin Panel</h1>
        </div>

        <nav className="mt-6">
          <ul>
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  className="flex items-center p-4 text-gray-300 hover:bg-gray-700 hover:text-white"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center w-full p-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded"
          >
            <FaSignOutAlt className="mr-3" />
            Logout
          </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;