import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaMicrophone, FaVideo, FaRobot, FaExternalLinkAlt, FaProjectDiagram } from 'react-icons/fa';
import api from '../services/api';

const Demo = () => {
  const [demos, setDemos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDemos = async () => {
      try {
        const res = await api.get('/demos');
        setDemos(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching demos:', err);
        setLoading(false);
      }
    };
    fetchDemos();
  }, []);

  if (loading) return null;

  return (
    <>
      <section id="demo" className="py-32 bg-[#050505] relative overflow-hidden">
        {/* Background Glows */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center mb-24"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-blue-500 font-black text-xs uppercase tracking-[0.4em] mb-4 block">Interactive Showcases</span>
            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6">
              Live AI <span className="text-gradient">Agent Demos</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg font-light">
              Experience the future of automation through real-time interactions with my custom AI voice and video agents.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
            {demos.map((demo, index) => (
              <motion.div
                key={demo._id}
                className="group relative"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
              >
                {/* Card Background with Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-40 transition-all duration-700"></div>

                <div className="relative h-full bg-[#0d0d0f] border border-white/5 rounded-[2.5rem] overflow-hidden p-8 md:p-12 transition-all duration-700 group-hover:border-blue-500/30">

                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-10">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 bg-blue-600/10 rounded-2xl flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform duration-500">
                          {demo.type === 'audio' ? <FaMicrophone className="text-blue-400 text-2xl" /> :
                            demo.type === 'video' ? <FaVideo className="text-purple-400 text-2xl" /> :
                              <FaRobot className="text-green-400 text-2xl" />}
                        </div>
                        <span className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-400">
                          {demo.type} Demo
                        </span>
                      </div>

                      <h3 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tighter group-hover:text-blue-400 transition-colors">
                        {demo.title}
                      </h3>
                      <p className="text-gray-400 leading-relaxed font-light text-base md:text-lg mb-6">
                        {demo.description}
                      </p>

                      {demo.project && (
                        <div className="inline-flex items-center gap-2 bg-blue-600/5 border border-blue-500/20 px-4 py-2 rounded-xl text-blue-400 text-xs font-bold transition-all hover:bg-blue-600/10">
                          <FaProjectDiagram size={12} />
                          Part of: {demo.project.title}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="relative rounded-[2rem] overflow-hidden bg-black/40 border border-white/5 p-4 group/media">
                    {demo.type === 'audio' ? (
                      <div className="py-12 px-8 flex flex-col items-center justify-center gap-8 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
                        <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center animate-pulse shadow-2xl shadow-blue-600/40 relative z-10">
                          <FaMicrophone className="text-white text-3xl" />
                        </div>
                        <audio controls className="w-full h-12 relative z-10 custom-audio-player">
                          <source src={demo.src} />
                        </audio>
                      </div>
                    ) : demo.type === 'video' ? (
                      <div className="aspect-video relative rounded-2xl overflow-hidden group/video">
                        <video
                          controls
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover/video:scale-105"
                        >
                          <source src={demo.src} />
                        </video>
                        <div className="absolute inset-0 bg-blue-600/10 pointer-events-none opacity-0 group-hover/video:opacity-100 transition-opacity"></div>
                      </div>
                    ) : (
                      <div className="py-20 flex flex-col items-center justify-center gap-8 bg-gradient-to-br from-blue-600/5 to-purple-600/5 rounded-2xl border border-white/5">
                        <div className="w-24 h-24 bg-green-600/20 border border-green-500/30 rounded-full flex items-center justify-center shadow-2xl shadow-green-600/20">
                          <FaRobot className="text-green-400 text-4xl animate-bounce" />
                        </div>
                        <a
                          href={demo.src}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white text-black font-black uppercase tracking-widest px-8 py-4 rounded-2xl hover:bg-blue-600 hover:text-white transition-all flex items-center gap-3 shadow-xl hover:scale-105 active:scale-95"
                        >
                          Open Live Bot <FaExternalLinkAlt size={14} />
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="mt-10 flex flex-wrap gap-3">
                    {demo.tags.map((tag, i) => (
                      <span key={i} className="bg-white/5 text-gray-400 text-[10px] font-black px-4 py-2 rounded-xl border border-white/5 uppercase tracking-widest transition-all hover:border-blue-500/30 hover:text-white">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .custom-audio-player::-webkit-media-controls-panel {
          background-color: #1f2937;
        }
        .custom-audio-player::-webkit-media-controls-current-time-display,
        .custom-audio-player::-webkit-media-controls-time-remaining-display {
          color: #ffffff;
        }
      `}</style>
    </>
  );
};

export default Demo;
