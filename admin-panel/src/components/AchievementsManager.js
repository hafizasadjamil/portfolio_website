import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaArrowLeft, FaSave, FaTimes, FaCloudUploadAlt, FaTrophy, FaCalendarAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

const AchievementsManager = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [currentAchievement, setCurrentAchievement] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: ''
  });
  const [icon, setIcon] = useState(null);
  const [iconPreview, setIconPreview] = useState('');

  const { id } = useParams();
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (id) {
      fetchAchievement(id);
    } else {
      fetchAchievements();
    }
  }, [id]);

  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http') || url.startsWith('blob:')) return url;
    const cleanUrl = url.startsWith('/') ? url.substring(1) : url;
    return `${API_URL}/${cleanUrl}`;
  };

  const fetchAchievements = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token
        }
      };

      const res = await axios.get(`${API_URL}/api/achievements`, config);
      setAchievements(res.data);
      setLoading(false);
    } catch (err) {
      toast.error('Failed to fetch achievements');
      setLoading(false);
    }
  };

  const fetchAchievement = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token
        }
      };

      const res = await axios.get(`${API_URL}/api/achievements/${id}`, config);
      const achievement = res.data;

      setFormData({
        title: achievement.title,
        description: achievement.description,
        date: achievement.date.split('T')[0]
      });

      setIconPreview(achievement.icon);
      setCurrentAchievement(achievement);
      setShowForm(true);
      setLoading(false);
    } catch (err) {
      toast.error('Failed to fetch achievement');
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setCurrentAchievement(null);
    setFormData({
      title: '',
      description: '',
      date: ''
    });
    setIcon(null);
    setIconPreview('');
    setShowForm(true);
  };

  const handleEdit = (achievement) => {
    setCurrentAchievement(achievement);
    setFormData({
      title: achievement.title,
      description: achievement.description,
      date: achievement.date.split('T')[0]
    });
    setIconPreview(achievement.icon);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this achievement?')) {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            'x-auth-token': token
          }
        };

        await axios.delete(`${API_URL}/api/achievements/${id}`, config);
        toast.success('Achievement deleted successfully');
        fetchAchievements();
      } catch (err) {
        toast.error('Failed to delete achievement');
      }
    }
  };

  const handleIconChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIcon(file);
      setIconPreview(URL.createObjectURL(file));
    }
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('date', formData.date);
    if (icon) {
      data.append('icon', icon);
    }

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token,
          'Content-Type': 'multipart/form-data'
        }
      };

      if (currentAchievement) {
        await axios.put(`${API_URL}/api/achievements/${currentAchievement._id}`, data, config);
        toast.success('Achievement updated successfully');
      } else {
        await axios.post(`${API_URL}/api/achievements`, data, config);
        toast.success('Achievement added successfully');
      }

      setShowForm(false);
      fetchAchievements();
      navigate('/achievements');
    } catch (err) {
      toast.error('Failed to save achievement');
    }
  };

  const cancelForm = () => {
    setShowForm(false);
    if (id) {
      navigate('/achievements');
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
              <button onClick={cancelForm} className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all">
                <FaArrowLeft />
              </button>
              <div>
                <h1 className="text-3xl font-black text-white tracking-tighter">
                  {currentAchievement ? 'Edit' : 'Add'} <span className="text-blue-500">Milestone</span>
                </h1>
                <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-1">Achievement Record</p>
              </div>
            </div>
            <button 
              onClick={onSubmit}
              className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center gap-3"
            >
              <FaSave /> Save Achievement
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-[#0d0d0f] border border-white/5 p-8 rounded-[2rem] space-y-6">
                <div>
                  <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-3">Achievement Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={onChange}
                    placeholder="e.g. Winner of AI Hackathon 2024"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-bold"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-3">Date Received</label>
                  <div className="relative">
                    <FaCalendarAlt className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600" />
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={onChange}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all text-sm font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-3">Details / Impact</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={onChange}
                    rows="5"
                    placeholder="Describe your achievement and its significance..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-medium leading-relaxed"
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-[#0d0d0f] border border-white/5 p-8 rounded-[2rem] space-y-6">
                <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-3 text-center">Milestone Icon</label>
                <div className="flex flex-col items-center gap-6">
                  <div className="w-32 h-32 rounded-[1.5rem] bg-white/5 border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden group hover:border-blue-500/50 transition-all">
                    {iconPreview ? (
                      <img src={getImageUrl(iconPreview)} alt="Icon" className="w-16 h-16 object-contain" />
                    ) : (
                      <FaTrophy className="text-4xl text-gray-700" />
                    )}
                  </div>
                  <label className="w-full px-6 py-3 bg-white/5 hover:bg-blue-600 text-white border border-white/10 hover:border-blue-500 rounded-xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest cursor-pointer transition-all">
                    <FaCloudUploadAlt size={16} /> Choose Image
                    <input type="file" onChange={handleIconChange} className="hidden" />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-16">
            <div>
              <h1 className="text-4xl font-black text-white tracking-tighter">Achievement <span className="text-blue-500">Gallery</span></h1>
              <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-2">Showcasing your career milestones</p>
            </div>
            <button 
              onClick={handleAdd}
              className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center gap-3"
            >
              <FaPlus /> New Milestone
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {achievements.map((achievement) => (
              <div key={achievement._id} className="bg-[#0d0d0f] border border-white/5 rounded-[2.5rem] p-10 group hover:border-blue-500/30 transition-all duration-500 flex flex-col h-full relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:bg-blue-500/10 transition-all duration-700"></div>
                
                <div className="flex justify-between items-start mb-8 relative z-10">
                  <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-500">
                    {achievement.icon ? (
                      <img src={getImageUrl(achievement.icon)} alt={achievement.title} className="w-10 h-10 object-contain" />
                    ) : (
                      <FaTrophy className="text-blue-500 text-2xl" />
                    )}
                  </div>
                  <span className="text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-gray-400">
                    {new Date(achievement.date).getFullYear()}
                  </span>
                </div>
                
                <div className="flex-grow relative z-10">
                  <h3 className="text-2xl font-black text-white mb-4 group-hover:text-blue-500 transition-colors tracking-tight leading-tight">{achievement.title}</h3>
                  <p className="text-gray-500 text-sm font-medium line-clamp-3 leading-relaxed">{achievement.description}</p>
                </div>

                <div className="flex gap-4 pt-8 mt-10 border-t border-white/5 relative z-10">
                  <button 
                    onClick={() => handleEdit(achievement)}
                    className="flex-1 bg-white/5 hover:bg-blue-600 text-white font-black uppercase tracking-widest text-[10px] py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(achievement._id)}
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

export default AchievementsManager;
