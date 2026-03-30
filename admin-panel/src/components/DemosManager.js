import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaArrowLeft, FaSave, FaTimes, FaCloudUploadAlt, FaPlayCircle, FaMicrophone, FaVideo, FaRobot, FaProjectDiagram, FaTag, FaLink } from 'react-icons/fa';

const DemosManager = () => {
  const [demos, setDemos] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [currentDemo, setCurrentDemo] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'audio',
    src: '',
    project: '',
    tags: ''
  });
  const [icon, setIcon] = useState(null);
  const [iconPreview, setIconPreview] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchDemos();
    fetchProjects();
  }, []);

  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http') || url.startsWith('blob:')) return url;
    const cleanUrl = url.startsWith('/') ? url.substring(1) : url;
    return `${API_URL}/${cleanUrl}`;
  };

  const fetchDemos = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/demos`);
      setDemos(res.data);
      setLoading(false);
    } catch (err) {
      toast.error('Failed to fetch demos');
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/projects`);
      setProjects(res.data);
    } catch (err) {
      console.error('Error fetching projects:', err);
    }
  };

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleIconChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIcon(file);
      setIconPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async e => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        'x-auth-token': token
      }
    };

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('type', formData.type);
    data.append('src', formData.src);
    data.append('project', formData.project);
    data.append('tags', formData.tags);
    if (icon) {
      data.append('icon', icon);
    }

    try {
      if (currentDemo) {
        await axios.put(`${API_URL}/api/demos/${currentDemo._id}`, data, config);
        toast.success('Demo updated successfully');
      } else {
        await axios.post(`${API_URL}/api/demos`, data, config);
        toast.success('Demo added successfully');
      }
      setShowForm(false);
      fetchDemos();
    } catch (err) {
      toast.error('Failed to save demo');
    }
  };

  const handleAdd = () => {
    setCurrentDemo(null);
    setFormData({
      title: '',
      description: '',
      type: 'audio',
      src: '',
      project: '',
      tags: ''
    });
    setIcon(null);
    setIconPreview('');
    setShowForm(true);
  };

  const handleEdit = demo => {
    setCurrentDemo(demo);
    setFormData({
      title: demo.title,
      description: demo.description,
      type: demo.type,
      src: demo.src,
      project: demo.project?._id || '',
      tags: demo.tags.join(', ')
    });
    setIconPreview(demo.icon);
    setShowForm(true);
  };

  const handleDelete = async id => {
    if (window.confirm('Are you sure you want to delete this demo?')) {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token
        }
      };
      try {
        await axios.delete(`${API_URL}/api/demos/${id}`, config);
        toast.success('Demo deleted successfully');
        fetchDemos();
      } catch (err) {
        toast.error('Failed to delete demo');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-[#050505]">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-10 bg-[#050505] min-h-screen">
      {showForm ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-6">
              <button onClick={() => setShowForm(false)} className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all">
                <FaArrowLeft />
              </button>
              <div>
                <h1 className="text-3xl font-black text-white tracking-tighter">
                  {currentDemo ? 'Edit' : 'Create'} <span className="text-blue-500">Demo</span>
                </h1>
                <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-1">Agent Configuration</p>
              </div>
            </div>
            <button
              onClick={onSubmit}
              className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center gap-3"
            >
              <FaSave /> Save Demo
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-[#0d0d0f] border border-white/5 p-8 rounded-[2rem] space-y-6">
                <div>
                  <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-3">Demo Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={onChange}
                    placeholder="e.g. AI Customer Service Agent"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-bold"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-3">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={onChange}
                    rows="4"
                    placeholder="Describe what this AI agent does..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-medium leading-relaxed"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-3">Agent Type</label>
                    <div className="relative">
                      <FaRobot className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600" />
                      <select
                        name="type"
                        value={formData.type}
                        onChange={onChange}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all text-sm font-bold appearance-none"
                      >
                        <option value="audio">Voice Agent (Audio)</option>
                        <option value="video">Video Avatar (Video)</option>
                        <option value="link">Interactive Bot (Link)</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-3">Linked Project</label>
                    <div className="relative">
                      <FaProjectDiagram className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600" />
                      <select
                        name="project"
                        value={formData.project}
                        onChange={onChange}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all text-sm font-bold appearance-none"
                      >
                        <option value="">No Project</option>
                        {projects.map(p => (
                          <option key={p._id} value={p._id}>{p.title}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-3">Source URL (Cloudinary/S3/YouTube)</label>
                  <div className="relative">
                    <FaLink className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600" />
                    <input
                      type="text"
                      name="src"
                      value={formData.src}
                      onChange={onChange}
                      placeholder="https://cloudinary.com/..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all text-sm font-bold"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-[#0d0d0f] border border-white/5 p-8 rounded-[2rem] space-y-6">
                <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-3 text-center">Custom Icon</label>
                <div className="flex flex-col items-center gap-6">
                  <div className="w-32 h-32 rounded-[1.5rem] bg-white/5 border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden group hover:border-blue-500/50 transition-all">
                    {iconPreview ? (
                      <img src={getImageUrl(iconPreview)} alt="Icon" className="w-16 h-16 object-contain" />
                    ) : (
                      <FaPlayCircle className="text-4xl text-gray-700" />
                    )}
                  </div>
                  <label className="w-full px-6 py-3 bg-white/5 hover:bg-blue-600 text-white border border-white/10 hover:border-blue-500 rounded-xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest cursor-pointer transition-all">
                    <FaCloudUploadAlt size={16} /> Choose Image
                    <input type="file" onChange={handleIconChange} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="bg-[#0d0d0f] border border-white/5 p-8 rounded-[2rem]">
                <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-4">Tags</label>
                <div className="relative">
                  <FaTag className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600" />
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={onChange}
                    placeholder="AI, Voice, Automation"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all text-sm font-bold"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-16">
            <div>
              <h1 className="text-4xl font-black text-white tracking-tighter">Demos & <span className="text-blue-500">Agents</span></h1>
              <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-2">Manage your interactive showcases</p>
            </div>
            <button
              onClick={handleAdd}
              className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center gap-3"
            >
              <FaPlus /> New Demo
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {demos.map((demo) => (
              <div key={demo._id} className="bg-[#0d0d0f] border border-white/5 rounded-[2.5rem] p-10 group hover:border-blue-500/30 transition-all duration-500 flex flex-col h-full relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:bg-blue-500/10 transition-all duration-700"></div>

                <div className="flex justify-between items-start mb-8 relative z-10">
                  <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-500">
                    {demo.icon ? (
                      <img src={getImageUrl(demo.icon)} alt={demo.title} className="w-10 h-10 object-contain" />
                    ) : (
                      <div className="text-blue-500 text-2xl">
                        {demo.type === 'audio' ? <FaMicrophone /> : demo.type === 'video' ? <FaVideo /> : <FaRobot />}
                      </div>
                    )}
                  </div>
                  <span className="text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-gray-400">
                    {demo.type}
                  </span>
                </div>

                <div className="flex-grow relative z-10">
                  <h3 className="text-2xl font-black text-white mb-2 group-hover:text-blue-500 transition-colors tracking-tight leading-tight">{demo.title}</h3>
                  <p className="text-blue-500/60 text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                    <FaProjectDiagram size={10} /> {demo.project?.title || 'Standalone Demo'}
                  </p>
                  <p className="text-gray-500 text-sm font-medium line-clamp-3 leading-relaxed">{demo.description}</p>
                </div>

                <div className="flex gap-4 pt-8 mt-10 border-t border-white/5 relative z-10">
                  <button
                    onClick={() => handleEdit(demo)}
                    className="flex-1 bg-white/5 hover:bg-blue-600 text-white font-black uppercase tracking-widest text-[10px] py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(demo._id)}
                    className="w-14 h-14 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white rounded-2xl transition-all flex items-center justify-center"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DemosManager;
