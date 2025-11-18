import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaProjectDiagram, FaTools, FaTrophy, FaGraduationCap, FaBlog, FaEnvelope, FaUsers, FaChartLine } from 'react-icons/fa';

const Dashboard = () => {
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    achievements: 0,
    education: 0,
    blogPosts: 0,
    messages: 0,
    unreadMessages: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            'x-auth-token': token
          }
        };

        const projectsRes = await axios.get('/api/projects', config);
        const skillsRes = await axios.get('/api/skills', config);
        const achievementsRes = await axios.get('/api/achievements', config);
        const educationRes = await axios.get('/api/education', config);
        const blogRes = await axios.get('/api/blog/admin', config);
        const messagesRes = await axios.get('/api/contact', config);

        const unreadMessages = messagesRes.data.filter(msg => !msg.read).length;

        setStats({
          projects: projectsRes.data.length,
          skills: skillsRes.data.length,
          achievements: achievementsRes.data.length,
          education: educationRes.data.length,
          blogPosts: blogRes.data.length,
          messages: messagesRes.data.length,
          unreadMessages
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchStats();
  }, []);

  const dashboardCards = [
    {
      title: 'Projects',
      count: stats.projects,
      icon: <FaProjectDiagram className="text-2xl" />,
      color: 'bg-blue-500',
      link: '/projects'
    },
    {
      title: 'Skills',
      count: stats.skills,
      icon: <FaTools className="text-2xl" />,
      color: 'bg-green-500',
      link: '/skills'
    },
    {
      title: 'Achievements',
      count: stats.achievements,
      icon: <FaTrophy className="text-2xl" />,
      color: 'bg-yellow-500',
      link: '/achievements'
    },
    {
      title: 'Education',
      count: stats.education,
      icon: <FaGraduationCap className="text-2xl" />,
      color: 'bg-purple-500',
      link: '/education'
    },
    {
      title: 'Blog Posts',
      count: stats.blogPosts,
      icon: <FaBlog className="text-2xl" />,
      color: 'bg-indigo-500',
      link: '/blog'
    },
    {
      title: 'Messages',
      count: stats.messages,
      icon: <FaEnvelope className="text-2xl" />,
      color: 'bg-red-500',
      link: '/messages',
      badge: stats.unreadMessages > 0 ? stats.unreadMessages : null
    }
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {dashboardCards.map((card, index) => (
          <Link 
            key={index} 
            to={card.link}
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className={`${card.color} w-12 h-12 rounded-full flex items-center justify-center text-white mr-4`}>
                {card.icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700">{card.title}</h3>
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-gray-900">{card.count}</span>
                  {card.badge && (
                    <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {card.badge}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/projects/new" className="bg-blue-500 text-white py-2 px-4 rounded text-center hover:bg-blue-600 transition">
            Add New Project
          </Link>
          <Link to="/blog/new" className="bg-indigo-500 text-white py-2 px-4 rounded text-center hover:bg-indigo-600 transition">
            Write Blog Post
          </Link>
          <Link to="/profile" className="bg-green-500 text-white py-2 px-4 rounded text-center hover:bg-green-600 transition">
            Update Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;