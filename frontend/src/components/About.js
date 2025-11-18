import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { FaGraduationCap, FaAward, FaBriefcase } from 'react-icons/fa';
import axios from 'axios';

const About = () => {
  const [profile, setProfile] = useState(null);
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [profileRes, educationRes] = await Promise.all([
          axios.get('http://localhost:5000/api/profile'),
          axios.get('http://localhost:5000/api/education')
        ]);
        
        setProfile(profileRes.data);
        setEducation(educationRes.data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const timelineEvents = [
    {
      date: '2021',
      title: 'Started Learning ML',
      description: 'Began my journey into machine learning and artificial intelligence.',
      icon: <FaBriefcase />,
      color: 'bg-blue-500'
    },
    {
      date: '2023',
      title: 'ITCN Asia Award',
      description: 'Won 70K prize for Best Startup Idea at ITCN Asia 2024.',
      icon: <FaAward />,
      color: 'bg-purple-500'
    },
    {
      date: '2023',
      title: 'Smart AI CRM',
      description: 'Developed an AI-powered CRM system with voice agent capabilities.',
      icon: <FaBriefcase />,
      color: 'bg-blue-500'
    },
    {
      date: '2024',
      title: 'FairHire Job Portal',
      description: 'Built an AI job portal with NLP resume parsing and recruiter chat.',
      icon: <FaBriefcase />,
      color: 'bg-blue-500'
    },
    {
      date: 'Present',
      title: 'AI Developer',
      description: 'Currently working as an AI Developer, building intelligent systems.',
      icon: <FaBriefcase />,
      color: 'bg-blue-500'
    }
  ];

  if (loading) {
    return (
      <section id="about" className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-white text-xl">Loading about data...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="about" className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-red-500 text-xl">{error}</div>
        </div>
      </section>
    );
  }

  return (
    <section id="about" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-white">About Me</h2>
        
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <motion.div
            className="lg:w-1/3 flex justify-center"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {profile && profile.profileImage ? (
              <img
                src={profile.profileImage}
                alt="Profile"
                className="w-64 h-64 rounded-full object-cover border-4 border-blue-500"
              />
            ) : (
              <div className="w-64 h-64 rounded-full bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center">
                <span className="text-5xl font-bold text-white">MAJ</span>
              </div>
            )}
          </motion.div>
          
          <motion.div
            className="lg:w-2/3"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="text-lg text-gray-300 mb-8">
              {profile ? profile.bio : "I am a Computer Science graduate passionate about Artificial Intelligence and intelligent systems. I specialize in Python, machine learning frameworks, and full-stack development. I love solving real-world problems with code, from building AI-powered applications to deploying production-ready systems."}
            </p>
            
            <h3 className="text-2xl font-bold mb-6 text-white">My Journey</h3>
            
            <VerticalTimeline lineColor="#3b82f6">
              {timelineEvents.map((event, index) => (
                <VerticalTimelineElement
                  key={index}
                  date={event.date}
                  dateClassName="text-blue-400"
                  iconStyle={{ background: event.color, color: '#fff' }}
                  icon={event.icon}
                  contentStyle={{ background: '#1f2937', color: '#fff' }}
                  contentArrowStyle={{ borderRight: '7px solid #3b82f6' }}
                >
                  <h3 className="text-xl font-bold text-white">{event.title}</h3>
                  <p className="text-gray-300">{event.description}</p>
                </VerticalTimelineElement>
              ))}
            </VerticalTimeline>
          </motion.div>
        </div>
        
        
      </div>
    </section>
  );
};

export default About;