import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCode, FaRobot, FaBriefcase, FaMicrophone, FaRocket, FaGraduationCap, FaCertificate, FaTrophy } from 'react-icons/fa';
import api from '../services/api';

const Journey = () => {
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJourney = async () => {
      try {
        const res = await api.get('/journey');
        setTimelineEvents(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching journey:', err);
        setLoading(false);
      }
    };
    fetchJourney();
  }, []);

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'FaCode': return <FaCode />;
      case 'FaRobot': return <FaRobot />;
      case 'FaBriefcase': return <FaBriefcase />;
      case 'FaMicrophone': return <FaMicrophone />;
      case 'FaRocket': return <FaRocket />;
      case 'FaGraduationCap': return <FaGraduationCap />;
      case 'FaCertificate': return <FaCertificate />;
      case 'FaTrophy': return <FaTrophy />;
      default: return <FaRocket />;
    }
  };

  if (loading) return null;
  if (timelineEvents.length === 0) return null;

  return (
    <section id="journey" className="py-32 bg-[#050505] relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <span className="text-blue-500 font-black text-xs uppercase tracking-[0.4em] mb-4 block">My Professional</span>
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6">
            The <span className="text-gradient">Journey</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto font-light text-lg">
            A dynamic timeline of my growth, projects, and professional milestones in the field of AI and Automation.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto relative">
          {/* Vertical Center Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/50 via-purple-500/50 to-transparent hidden md:block"></div>

          <div className="space-y-24">
            {timelineEvents.map((event, index) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "circOut" }}
                className={`flex flex-col md:flex-row items-center gap-12 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
              >
                {/* Content Card */}
                <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                  <div className="group relative bg-[#0d0d0f] border border-white/5 p-10 rounded-[2.5rem] hover:border-blue-500/30 transition-all duration-700 hover:shadow-2xl hover:shadow-blue-500/10">
                    {/* Decorative glow */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${event.color} opacity-0 group-hover:opacity-5 rounded-[2.5rem] transition-opacity duration-700`}></div>

                    <div className={`flex flex-col ${index % 2 === 0 ? 'md:items-end' : 'md:items-start'}`}>
                      <span className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-blue-400 mb-6">
                        {event.date}
                      </span>
                      <h3 className="text-3xl font-black text-white mb-4 tracking-tighter group-hover:text-blue-400 transition-colors leading-tight">
                        {event.title}
                      </h3>
                      <p className="text-gray-400 font-light leading-relaxed text-lg">
                        {event.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Center Icon */}
                <div className="relative z-20 shrink-0">
                  <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${event.color} flex items-center justify-center text-white shadow-2xl shadow-blue-500/40 transform rotate-12 group-hover:rotate-0 transition-transform duration-700 group-hover:scale-110`}>
                    <div className="text-3xl -rotate-12 group-hover:rotate-0 transition-transform duration-700">
                      {getIcon(event.icon)}
                    </div>
                  </div>
                  {/* Pulse effect */}
                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${event.color} animate-ping opacity-20 pointer-events-none`}></div>
                </div>

                {/* Spacer for other side */}
                <div className="hidden md:block md:w-1/2"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Journey;
