import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaArrowLeft, FaSave, FaRocket, FaGraduationCap, FaBriefcase, FaCode, FaCertificate, FaTrophy, FaPalette } from 'react-icons/fa';

const JourneyManager = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [formData, setFormData] = useState({
    date: '',
    title: '',
    description: '',
    icon: 'FaRocket',
    color: 'from-blue-500 to-cyan-400',
    order: 0
  });

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchJourney();
  }, []);

  const fetchJourney = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/journey`);
      setEvents(res.data);
      setLoading(false);
    } catch (err) {
      toast.error('Failed to fetch journey data');
      setLoading(false);
    }
  };

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      }
    };

    try {
      if (currentEvent) {
        await axios.put(`${API_URL}/api/journey/${currentEvent._id}`, formData, config);
        toast.success('Journey event updated');
      } else {
        await axios.post(`${API_URL}/api/journey`, formData, config);
        toast.success('Journey event added');
      }
      setShowForm(false);
      fetchJourney();
    } catch (err) {
      toast.error('Failed to save event');
    }
  };

  const handleAdd = () => {
    setCurrentEvent(null);
    setFormData({
      date: '',
      title: '',
      description: '',
      icon: 'FaRocket',
      color: 'from-blue-500 to-cyan-400',
      order: events.length
    });
    setShowForm(true);
  };

  const handleEdit = event => {
    setCurrentEvent(event);
    setFormData({
      date: event.date,
      title: event.title,
      description: event.description,
      icon: event.icon,
      color: event.color,
      order: event.order
    });
    setShowForm(true);
  };

  const handleDelete = async id => {
    if (window.confirm('Delete this journey event?')) {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token
        }
      };
      try {
        await axios.delete(`${API_URL}/api/journey/${id}`, config);
        toast.success('Event removed');
        fetchJourney();
      } catch (err) {
        toast.error('Failed to delete event');
      }
    }
  };

  const icons = [
    { name: 'FaRocket', icon: <FaRocket /> },
    { name: 'FaGraduationCap', icon: <FaGraduationCap /> },
    { name: 'FaBriefcase', icon: <FaBriefcase /> },
    { name: 'FaCode', icon: <FaCode /> },
    { name: 'FaCertificate', icon: <FaCertificate /> },
    { name: 'FaTrophy', icon: <FaTrophy /> }
  ];

  const colors = [
    { name: 'Blue', value: 'from-blue-500 to-cyan-400' },
    { name: 'Purple', value: 'from-purple-500 to-pink-500' },
    { name: 'Orange', value: 'from-orange-500 to-yellow-500' },
    { name: 'Green', value: 'from-green-500 to-emerald-400' },
    { name: 'Red', value: 'from-red-500 to-rose-500' }
  ];

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
                  {currentEvent ? 'Edit' : 'Create'} <span className="text-blue-500">Journey Event</span>
                </h1>
                <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-1">Timeline Configuration</p>
              </div>
            </div>
            <button 
              onClick={onSubmit}
              className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center gap-3"
            >
              <FaSave /> Save Event
            </button>
          </div>

          <div className="bg-[#0d0d0f] border border-white/5 p-8 rounded-[2rem] space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-3">Event Date</label>
                <input
                  type="text"
                  name="date"
                  value={formData.date}
                  onChange={onChange}
                  placeholder="e.g. 2023 - Present"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-bold"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-3">Event Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={onChange}
                  placeholder="e.g. Senior AI Engineer"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-3">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={onChange}
                rows="4"
                placeholder="Describe your role or milestone..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-medium leading-relaxed"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-3">Visual Icon</label>
                <div className="grid grid-cols-6 gap-3">
                  {icons.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => setFormData({ ...formData, icon: item.name })}
                      className={`w-full aspect-square rounded-xl flex items-center justify-center text-xl transition-all ${
                        formData.icon === item.name 
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                          : 'bg-white/5 text-gray-500 hover:bg-white/10'
                      }`}
                    >
                      {item.icon}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-3">Theme Color</label>
                <div className="grid grid-cols-5 gap-3">
                  {colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setFormData({ ...formData, color: color.value })}
                      className={`w-full aspect-square rounded-xl bg-gradient-to-br ${color.value} transition-all relative group`}
                    >
                      {formData.color === color.value && (
                        <div className="absolute inset-0 border-4 border-white rounded-xl"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-3">Display Order</label>
              <input
                type="number"
                name="order"
                value={formData.order}
                onChange={onChange}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-bold"
              />
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-16">
            <div>
              <h1 className="text-4xl font-black text-white tracking-tighter">My <span className="text-blue-500">Journey</span></h1>
              <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-2">Dynamic Timeline Management</p>
            </div>
            <button 
              onClick={handleAdd}
              className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center gap-3"
            >
              <FaPlus /> Add Milestone
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {events.map((event) => (
              <div key={event._id} className="bg-[#0d0d0f] border border-white/5 rounded-[2rem] p-8 flex flex-col md:flex-row items-center gap-8 group hover:border-blue-500/30 transition-all duration-500">
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${event.color} flex items-center justify-center text-white text-3xl shrink-0 shadow-lg`}>
                  {icons.find(i => i.name === event.icon)?.icon || <FaRocket />}
                </div>
                
                <div className="flex-grow">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-blue-500 font-black text-[10px] uppercase tracking-widest">{event.date}</span>
                    <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
                    <h3 className="text-xl font-black text-white tracking-tight">{event.title}</h3>
                  </div>
                  <p className="text-gray-500 text-sm font-medium line-clamp-2">{event.description}</p>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => handleEdit(event)}
                    className="w-12 h-12 bg-white/5 hover:bg-blue-600 text-white rounded-xl transition-all flex items-center justify-center"
                  >
                    <FaEdit />
                  </button>
                  <button 
                    onClick={() => handleDelete(event._id)}
                    className="w-12 h-12 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white rounded-xl transition-all flex items-center justify-center"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              </div>
            ))}
            {events.length === 0 && (
              <div className="text-center py-32 bg-[#0d0d0f] border border-white/5 rounded-[3rem]">
                <FaRocket className="text-6xl text-gray-800 mx-auto mb-6 animate-bounce" />
                <h3 className="text-2xl font-black text-white mb-2">The Journey Begins Here</h3>
                <p className="text-gray-600">Start adding milestones to your professional timeline.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default JourneyManager;
