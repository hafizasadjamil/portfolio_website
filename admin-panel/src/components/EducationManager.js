import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaArrowLeft, FaSave, FaTimes, FaGraduationCap, FaCalendarAlt, FaBook } from 'react-icons/fa';
import { motion } from 'framer-motion';

const EducationManager = () => {
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [currentEducation, setCurrentEducation] = useState(null);
  const [formData, setFormData] = useState({
    institution: '',
    degree: '',
    field: '',
    startDate: '',
    endDate: '',
    description: ''
  });
  
  const { id } = useParams();
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (id) {
      fetchEducation(id);
    } else {
      fetchEducationList();
    }
  }, [id]);

  const fetchEducationList = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token
        }
      };
      
      const res = await axios.get(`${API_URL}/api/education`, config);
      setEducation(res.data);
      setLoading(false);
    } catch (err) {
      toast.error('Failed to fetch education');
      setLoading(false);
    }
  };

  const fetchEducation = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token
        }
      };
      
      const res = await axios.get(`${API_URL}/api/education/${id}`, config);
      const edu = res.data;
      
      setFormData({
        institution: edu.institution,
        degree: edu.degree,
        field: edu.field,
        startDate: edu.startDate.split('T')[0],
        endDate: edu.endDate ? edu.endDate.split('T')[0] : '',
        description: edu.description
      });
      
      setCurrentEducation(edu);
      setShowForm(true);
      setLoading(false);
    } catch (err) {
      toast.error('Failed to fetch education');
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setCurrentEducation(null);
    setFormData({
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      description: ''
    });
    setShowForm(true);
  };

  const handleEdit = (edu) => {
    setCurrentEducation(edu);
    setFormData({
      institution: edu.institution,
      degree: edu.degree,
      field: edu.field,
      startDate: edu.startDate.split('T')[0],
      endDate: edu.endDate ? edu.endDate.split('T')[0] : '',
      description: edu.description
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this education record?')) {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            'x-auth-token': token
          }
        };
        
        await axios.delete(`${API_URL}/api/education/${id}`, config);
        toast.success('Deleted successfully');
        fetchEducationList();
      } catch (err) {
        toast.error('Failed to delete');
      }
    }
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token
        }
      };

      if (currentEducation) {
        await axios.put(`${API_URL}/api/education/${currentEducation._id}`, formData, config);
        toast.success('Updated successfully');
      } else {
        await axios.post(`${API_URL}/api/education`, formData, config);
        toast.success('Added successfully');
      }
      
      setShowForm(false);
      fetchEducationList();
      navigate('/education');
    } catch (err) {
      toast.error('Failed to save');
    }
  };

  const cancelForm = () => {
    setShowForm(false);
    if (id) {
      navigate('/education');
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
                  {currentEducation ? 'Edit' : 'Add'} <span className="text-blue-500">Education</span>
                </h1>
                <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-1">Academic Background</p>
              </div>
            </div>
            <button 
              onClick={onSubmit}
              className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center gap-3"
            >
              <FaSave /> Save Education
            </button>
          </div>

          <div className="bg-[#0d0d0f] border border-white/5 p-10 rounded-[2.5rem] space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-3">Institution Name</label>
                <input
                  type="text"
                  name="institution"
                  value={formData.institution}
                  onChange={onChange}
                  placeholder="e.g. Stanford University"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-bold"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-3">Degree / Qualification</label>
                <input
                  type="text"
                  name="degree"
                  value={formData.degree}
                  onChange={onChange}
                  placeholder="e.g. Bachelor of Science"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-3">Field of Study</label>
                <div className="relative">
                  <FaBook className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600" />
                  <input
                    type="text"
                    name="field"
                    value={formData.field}
                    onChange={onChange}
                    placeholder="e.g. Computer Science"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all text-sm font-bold"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-3">Start Date</label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600" />
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={onChange}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all text-sm font-bold"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-3">End Date (or Expected)</label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600" />
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={onChange}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all text-sm font-bold"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-3">Description / Key Achievements</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={onChange}
                rows="5"
                placeholder="List major courses, GPA, or societies..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-medium leading-relaxed"
              ></textarea>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-16">
            <div>
              <h1 className="text-4xl font-black text-white tracking-tighter">Academic <span className="text-blue-500">Timeline</span></h1>
              <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-2">Manage your educational history</p>
            </div>
            <button 
              onClick={handleAdd}
              className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center gap-3"
            >
              <FaPlus /> Add Education
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {education.map((edu) => (
              <div key={edu._id} className="bg-[#0d0d0f] border border-white/5 rounded-[2.5rem] p-10 group hover:border-blue-500/30 transition-all duration-500 flex flex-col h-full relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:bg-blue-500/10 transition-all duration-700"></div>
                
                <div className="flex justify-between items-start mb-8 relative z-10">
                  <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-500">
                    <FaGraduationCap className="text-blue-500 text-2xl" />
                  </div>
                  <span className="text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-gray-400">
                    {new Date(edu.startDate).getFullYear()} - {edu.endDate ? new Date(edu.endDate).getFullYear() : 'Present'}
                  </span>
                </div>
                
                <div className="flex-grow relative z-10">
                  <h3 className="text-2xl font-black text-white mb-2 group-hover:text-blue-500 transition-colors tracking-tight leading-none">{edu.degree}</h3>
                  <p className="text-blue-500/60 text-[10px] font-black uppercase tracking-widest mb-4">{edu.institution}</p>
                  <p className="text-gray-500 text-sm font-medium line-clamp-3 leading-relaxed">{edu.description}</p>
                </div>

                <div className="flex gap-4 pt-8 mt-10 border-t border-white/5 relative z-10">
                  <button 
                    onClick={() => handleEdit(edu)}
                    className="flex-1 bg-white/5 hover:bg-blue-600 text-white font-black uppercase tracking-widest text-[10px] py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(edu._id)}
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

export default EducationManager;
