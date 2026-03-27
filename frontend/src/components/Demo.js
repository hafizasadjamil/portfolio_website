import React from 'react';
import { motion } from 'framer-motion';
import { FaMicrophone, FaVideo } from 'react-icons/fa';

const Demo = () => {
  const demos = [
    {
      id: 1,
      title: "AI Voice Agent Demo",
      description: "A demonstration of our conversational AI voice agent capable of handling real-time customer queries with natural language understanding.",
      type: "audio",
      src: "https://res.cloudinary.com/djevhqupv/video/upload/v1774565186/server-0-recording-20250505-100515_qdjCymly_x1vfgr.wav",
      icon: <FaMicrophone className="text-blue-400 text-2xl" />,
      tags: ["AI", "Voice", "NLP"]
    },
    {
      id: 2,
      title: "Chatbot & Calling Agent",
      description: "Watch our intelligent calling agent in action, managing outbound calls and providing automated support through a seamless video interface.",
      type: "video",
      src: "https://res.cloudinary.com/djevhqupv/video/upload/v1774565430/video_soeqes.mp4",
      icon: <FaVideo className="text-purple-400 text-2xl" />,
      tags: ["Automation", "Video", "Chatbot"]
    }
  ];

  return (
    <section id="demo" className="py-24 bg-gray-950 hero-gradient">
      <div className="container mx-auto px-4">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Interactive <span className="text-gradient">AI Demos</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {demos.map((demo, index) => (
            <motion.div
              key={demo.id}
              className="glass-card rounded-3xl overflow-hidden group hover:glow-purple transition-all duration-500"
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.8 }}
            >
              <div className="p-10">
                <div className="flex items-center gap-5 mb-8">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10 group-hover:scale-110 transition-transform duration-500">
                    {demo.icon}
                  </div>
                  <h3 className="text-3xl font-black text-white tracking-tight">{demo.title}</h3>
                </div>

                <p className="text-gray-400 mb-10 leading-relaxed text-lg font-light">
                  {demo.description}
                </p>

                <div className="space-y-8">
                  {demo.type === "audio" ? (
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm">
                      <audio controls className="w-full h-10 custom-audio-player">
                        <source src={demo.src} type="audio/wav" />
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  ) : (
                    <div className="relative aspect-video bg-white/5 rounded-2xl overflow-hidden border border-white/10 group/video">
                      <video
                        controls
                        className="w-full h-full object-cover transition-transform duration-700 group-hover/video:scale-105"
                        poster="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800"
                      >
                        <source src={demo.src} type="video/mp4" />
                        Your browser does not support the video element.
                      </video>
                      <div className="absolute inset-0 bg-blue-600/10 pointer-events-none"></div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3">
                    {demo.tags.map((tag, i) => (
                      <span key={i} className="bg-white/5 text-gray-300 text-[10px] font-bold px-4 py-1.5 rounded-full border border-white/10 uppercase tracking-widest group-hover:border-purple-500/30 transition-colors">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .custom-audio-player::-webkit-media-controls-panel {
          background-color: #1f2937;
        }
        .custom-audio-player::-webkit-media-controls-current-time-display,
        .custom-audio-player::-webkit-media-controls-time-remaining-display {
          color: #ffffff;
        }
      `}</style>
    </section>
  );
};

export default Demo;
