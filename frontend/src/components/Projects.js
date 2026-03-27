import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api, { getImageUrl } from '../services/api';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const res = await api.get('/projects');
        setProjects(res.data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch projects:', err);
        setError('Failed to load projects data');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <section id="projects" className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-white text-xl">Loading projects...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="projects" className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-red-500 text-xl">{error}</div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-32 bg-gray-950 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-blue-500 font-black text-xs uppercase tracking-[0.3em] mb-4 block">PORTFOLIO</span>
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-4">
            Featured <span className="text-gradient">Projects</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg font-light">
            A collection of my most impactful work in AI automation, software engineering, and intelligent systems.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {projects.map((project, index) => (
            <motion.div
              key={project._id}
              className="glass-card rounded-[2rem] overflow-hidden group transition-all duration-700 h-full flex flex-col border border-white/5 hover:border-blue-500/30"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
              whileHover={{
                y: -10,
                scale: 1.02,
                transition: { duration: 0.4, ease: "easeOut" }
              }}
            >
              <div className="h-72 overflow-hidden relative">
                {project.images && project.images.length > 0 ? (
                  <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar h-full group/gallery">
                    {project.images.map((img, i) => (
                      <div key={i} className="min-w-full h-full snap-center relative">
                        <img
                          src={getImageUrl(img)}
                          alt={`${project.title} - ${i + 1}`}
                          className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent opacity-80"></div>
                      </div>
                    ))}
                    {/* Gallery Indicators */}
                    {project.images.length > 1 && (
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                        {project.images.map((_, i) => (
                          <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/30"></div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : project.image ? (
                  <div className="h-full relative">
                    <img
                      src={getImageUrl(project.image)}
                      alt={project.title}
                      className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent opacity-80"></div>
                  </div>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center">
                    <span className="text-6xl font-black text-white/10 uppercase">{project.title.charAt(0)}</span>
                  </div>
                )}

                {/* Tech Stack Badges */}
                <div className="absolute top-6 left-6 flex flex-wrap gap-2 z-10 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-[-10px] group-hover:translate-y-0">
                  {project.techStack.map((tech, i) => (
                    <span key={i} className="bg-blue-600/20 backdrop-blur-md text-blue-400 text-[9px] px-3 py-1 rounded-full border border-blue-500/30 uppercase tracking-widest font-black">
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end z-10">
                  <div className="flex gap-2">
                    {project.techStack.slice(0, 3).map((tech, i) => (
                      <span key={i} className="bg-white/10 backdrop-blur-md text-white text-[9px] px-2 py-1 rounded-md border border-white/10 uppercase tracking-wider font-bold">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-10 flex flex-col flex-grow">
                <h3 className="text-3xl font-black mb-4 text-white group-hover:text-blue-400 transition-colors tracking-tight">{project.title}</h3>
                <p className="text-gray-400 mb-8 line-clamp-3 leading-relaxed text-base font-light flex-grow">{project.description}</p>

                <div className="flex items-center gap-6 pt-8 border-t border-white/5">
                  <a
                    href={project.githubUrl || "#"}
                    target={project.githubUrl ? "_blank" : "_self"}
                    rel="noopener noreferrer"
                    className={`text-gray-400 hover:text-white flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] transition-all ${!project.githubUrl && 'opacity-20 cursor-not-allowed'}`}
                  >
                    <FaGithub size={18} /> Source
                  </a>

                  <a
                    href={project.demoUrl || "#"}
                    target={project.demoUrl ? "_blank" : "_self"}
                    rel="noopener noreferrer"
                    className={`bg-white/5 hover:bg-blue-600 text-white border border-white/10 hover:border-blue-500 px-6 py-3 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl group-hover:glow-blue ${!project.demoUrl && 'opacity-20 cursor-not-allowed'}`}
                  >
                    <FaExternalLinkAlt size={12} /> Live Demo
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;