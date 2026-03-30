import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTachometerAlt, FaProjectDiagram, FaTools, FaTrophy, FaGraduationCap, FaBlog, FaEnvelope, FaUser, FaSignOutAlt, FaBars, FaTimes, FaCode, FaPlayCircle, FaRoute, FaSearch } from 'react-icons/fa';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  const menuItems = [
    { path: '/dashboard', icon: <FaTachometerAlt />, label: 'Dashboard' },
    { path: '/projects', icon: <FaProjectDiagram />, label: 'Projects' },
    { path: '/skills', icon: <FaTools />, label: 'Skills' },
    { path: '/journey', icon: <FaRoute />, label: 'Journey' },
    { path: '/demos', icon: <FaPlayCircle />, label: 'Demos & Bots' },
    { path: '/job-scraper', icon: <FaSearch />, label: 'Job Scraper' },
    { path: '/achievements', icon: <FaTrophy />, label: 'Achievements' },
    { path: '/education', icon: <FaGraduationCap />, label: 'Education' },
    { path: '/course-certifications', icon: <FaGraduationCap />, label: 'Courses' },
    { path: '/blog', icon: <FaBlog />, label: 'Blog' },
    { path: '/leetcode-progress', icon: <FaCode />, label: 'LeetCode' },
    { path: '/messages', icon: <FaEnvelope />, label: 'Messages' },
    { path: '/profile', icon: <FaUser />, label: 'Profile' },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-6 left-6 z-[60]">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-blue-600 text-white p-3 rounded-2xl shadow-lg shadow-blue-600/20"
        >
          {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`bg-[#0a0a0c] border-r border-white/5 text-white w-72 min-h-screen fixed lg:relative z-50 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] flex flex-col`}
      >
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
              <span className="font-black text-xl">A</span>
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tighter uppercase">Asad <span className="text-blue-500">Admin</span></h1>
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Control Center</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 mt-8 px-4 overflow-y-auto no-scrollbar">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  className={`flex items-center p-4 rounded-2xl transition-all group ${window.location.pathname === item.path
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                  onClick={() => setIsOpen(false)}
                >
                  <span className={`mr-4 text-xl transition-transform group-hover:scale-110 ${window.location.pathname === item.path ? 'text-white' : 'text-blue-500/50 group-hover:text-blue-500'
                    }`}>
                    {item.icon}
                  </span>
                  <span className="font-bold text-sm tracking-tight">{item.label}</span>
                  {window.location.pathname === item.path && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-6 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="flex items-center w-full p-4 text-red-400 hover:bg-red-500/10 rounded-2xl transition-all group font-bold text-sm tracking-tight"
          >
            <FaSignOutAlt className="mr-4 text-xl group-hover:translate-x-1 transition-transform" />
            Logout Account
          </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-all duration-500"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;