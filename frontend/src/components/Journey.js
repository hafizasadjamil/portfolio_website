import React from 'react';
import { motion } from 'framer-motion';
import { FaCode, FaRobot, FaBriefcase, FaMicrophone, FaRocket } from 'react-icons/fa';

const Journey = () => {
  const timelineEvents = [
    {
      date: '2022',
      title: 'Started Learning ML',
      description: 'Began my journey into Machine Learning & AI fundamentals, mastering core concepts and frameworks.',
      icon: <FaCode />,
      color: 'from-blue-500 to-cyan-400'
    },
    {
      date: '2023',
      title: 'Advanced AI Projects',
      description: 'Continued deep diving into ML, building initial AI projects and exploring real-world applications.',
      icon: <FaRobot />,
      color: 'from-indigo-500 to-blue-500'
    },
    {
      date: '2024 - 2025',
      title: 'Freelance AI Development',
      description: 'Worked on diverse freelance AI projects specializing in LLMs, FastAPI, and complex automation systems.',
      icon: <FaBriefcase />,
      color: 'from-purple-500 to-indigo-500'
    },
    {
      date: '2024 - 2025',
      title: 'Smart AI CRM',
      description: 'Architected and built a Smart AI CRM with advanced voice agent capabilities and end-to-end automation.',
      icon: <FaMicrophone />,
      color: 'from-blue-600 to-indigo-600'
    },
    {
      date: '2025',
      title: 'FairHire AI Job Portal',
      description: 'Developed FairHire, an AI-driven job portal featuring intelligent resume parsing and automated matching.',
      icon: <FaRocket />,
      color: 'from-green-500 to-emerald-400'
    },
    {
      date: '2025',
      title: 'Professional AI Developer',
      description: 'Worked as an AI Developer at ITGenics and Nextbridge, successfully deploying real-world AI systems at scale.',
      icon: <FaBriefcase />,
      color: 'from-indigo-600 to-purple-600'
    },
    {
      date: 'Present',
      title: 'AI Automation Engineer',
      description: 'Building production-level AI systems including voice agents, chatbots, and advanced automation workflows.',
      icon: <FaRobot />,
      color: 'from-blue-500 to-purple-500'
    }
  ];

  return (
    <section id="journey" className="py-24 bg-gray-950 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="section-title">My Professional <span className="text-gradient">Journey</span></h2>
          <p className="text-gray-400 max-w-2xl mx-auto font-light text-lg">
            A timeline of my growth, projects, and professional milestones in the field of AI and Automation.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto relative">
          {/* Vertical Center Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500 via-purple-500 to-transparent hidden md:block"></div>

          <div className="space-y-12">
            {timelineEvents.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`flex flex-col md:flex-row items-center gap-8 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Content Card */}
                <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                  <div className="glass-card p-8 rounded-3xl hover:bg-white/5 transition-all duration-500 group relative">
                    <div className={`absolute top-0 ${index % 2 === 0 ? 'right-0' : 'left-0'} w-1 h-full bg-gradient-to-b ${event.color} rounded-full`}></div>
                    <span className="text-blue-400 font-black text-sm tracking-[0.2em] mb-3 block uppercase">{event.date}</span>
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">{event.title}</h3>
                    <p className="text-gray-400 font-light leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                </div>

                {/* Center Icon */}
                <div className="relative z-20">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${event.color} flex items-center justify-center text-white shadow-2xl shadow-blue-500/20 transform rotate-45 group-hover:rotate-90 transition-transform duration-500`}>
                    <div className="-rotate-45">{event.icon}</div>
                  </div>
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
