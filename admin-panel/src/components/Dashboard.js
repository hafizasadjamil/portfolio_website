import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaProjectDiagram, FaTools, FaTrophy, FaGraduationCap, FaBlog, FaEnvelope, FaPlayCircle, FaCode, FaRoute } from 'react-icons/fa';

const Dashboard = () => {
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    achievements: 0,
    education: 0,
    blogPosts: 0,
    messages: 0,
    demos: 0,
    journey: 0,
    unreadMessages: 0
  });

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            'x-auth-token': token
          }
        };

        const [projectsRes, skillsRes, achievementsRes, educationRes, blogRes, messagesRes, demosRes, journeyRes] = await Promise.all([
          axios.get(`${API_URL}/api/projects`, config),
          axios.get(`${API_URL}/api/skills`, config),
          axios.get(`${API_URL}/api/achievements`, config),
          axios.get(`${API_URL}/api/education`, config),
          axios.get(`${API_URL}/api/blog/admin`, config),
          axios.get(`${API_URL}/api/contact`, config),
          axios.get(`${API_URL}/api/demos`, config),
          axios.get(`${API_URL}/api/journey`, config)
        ]);

        const unreadMessages = messagesRes.data.filter(msg => !msg.read).length;

        setStats({
          projects: projectsRes.data.length,
          skills: skillsRes.data.length,
          achievements: achievementsRes.data.length,
          education: educationRes.data.length,
          blogPosts: blogRes.data.length,
          messages: messagesRes.data.length,
          demos: demosRes.data.length,
          journey: journeyRes.data.length,
          unreadMessages
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchStats();
  }, [API_URL]);

  const dashboardCards = [
    {
      title: 'Projects',
      count: stats.projects,
      icon: <FaProjectDiagram />,
      color: 'from-blue-600 to-blue-400',
      link: '/projects'
    },
    {
      title: 'Skills',
      count: stats.skills,
      icon: <FaTools />,
      color: 'from-green-600 to-green-400',
      link: '/skills'
    },
    {
      title: 'The Journey',
      count: stats.journey,
      icon: <FaRoute />,
      color: 'from-cyan-600 to-cyan-400',
      link: '/journey'
    },
    {
      title: 'Demos & Bots',
      count: stats.demos,
      icon: <FaPlayCircle />,
      color: 'from-purple-600 to-purple-400',
      link: '/demos'
    },
    {
      title: 'Achievements',
      count: stats.achievements,
      icon: <FaTrophy />,
      color: 'from-yellow-600 to-yellow-400',
      link: '/achievements'
    },
    {
      title: 'Blog Posts',
      count: stats.blogPosts,
      icon: <FaBlog />,
      color: 'from-indigo-600 to-indigo-400',
      link: '/blog'
    },
    {
      title: 'Messages',
      count: stats.messages,
      icon: <FaEnvelope />,
      color: 'from-red-600 to-red-400',
      link: '/messages',
      badge: stats.unreadMessages > 0 ? stats.unreadMessages : null
    }
  ];

  return (
    <div className="p-10 bg-[#050505] min-h-screen">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter">Command <span className="text-blue-500">Center</span></h2>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-2">Overview of your digital ecosystem</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl">
            <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest block">System Status</span>
            <span className="text-green-500 text-xs font-black uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Operational
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {dashboardCards.map((card, index) => (
          <Link
            key={index}
            to={card.link}
            className="group relative"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-10 blur-2xl rounded-[2.5rem] transition-all duration-500`}></div>
            <div className="relative bg-[#0d0d0f] border border-white/5 p-10 rounded-[2.5rem] group-hover:border-white/10 transition-all duration-500 h-full overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:bg-white/10 transition-all duration-500"></div>

              <div className="flex justify-between items-start mb-8 relative z-10">
                <div className={`w-14 h-14 bg-gradient-to-br ${card.color} rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg transition-transform group-hover:scale-110 duration-500`}>
                  {card.icon}
                </div>
                {card.badge && (
                  <span className="bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full animate-bounce">
                    {card.badge} NEW
                  </span>
                )}
              </div>

              <div className="relative z-10">
                <h3 className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{card.title}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-white tracking-tighter">{card.count}</span>
                  <span className="text-gray-600 text-sm font-bold uppercase tracking-widest">Entries</span>
                </div>
              </div>

              <div className="mt-8 flex items-center text-blue-500 text-[10px] font-black uppercase tracking-widest group-hover:gap-3 transition-all">
                Manage Section <span>→</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;