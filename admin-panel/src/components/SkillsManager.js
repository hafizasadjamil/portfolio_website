import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaArrowLeft, FaSave, FaTimes, FaCloudUploadAlt, FaTools, FaLayerGroup, FaTachometerAlt, FaLink } from 'react-icons/fa';
import { motion } from 'framer-motion';

const SkillsManager = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [currentSkill, setCurrentSkill] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    level: 'Intermediate',
    description: '',
    highlight: false,
    iconUrl: ''
  });
  const [icon, setIcon] = useState(null);
  const [iconPreview, setIconPreview] = useState('');

  const { id } = useParams();
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (id) {
      fetchSkill(id);
    } else {
      fetchSkills();
    }
  }, [id]);

  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http') || url.startsWith('blob:')) return url;
    const cleanUrl = url.startsWith('/') ? url.substring(1) : url;
    return `${API_URL}/${cleanUrl}`;
  };

  const fetchSkills = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token
        }
      };

      const res = await axios.get(`${API_URL}/api/skills`, config);
      setSkills(res.data);
      setLoading(false);
    } catch (err) {
      toast.error('Failed to fetch skills');
      setLoading(false);
    }
  };

  const fetchSkill = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token
        }
      };

      const res = await axios.get(`${API_URL}/api/skills/${id}`, config);
      const skill = res.data;

      setFormData({
        name: skill.name,
        category: skill.category,
        level: skill.level,
        description: skill.description,
        highlight: skill.highlight || false,
        iconUrl: skill.icon && skill.icon.startsWith('http') ? skill.icon : ''
      });

      setIconPreview(skill.icon);
      setCurrentSkill(skill);
      setShowForm(true);
      setLoading(false);
    } catch (err) {
      toast.error('Failed to fetch skill');
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setCurrentSkill(null);
    setFormData({
      name: '',
      category: '',
      level: 'Intermediate',
      description: '',
      highlight: false,
      iconUrl: ''
    });
    setIcon(null);
    setIconPreview('');
    setShowForm(true);
  };

  const handleEdit = (skill) => {
    setCurrentSkill(skill);
    setFormData({
      name: skill.name,
      category: skill.category,
      level: skill.level,
      description: skill.description,
      highlight: skill.highlight || false,
      iconUrl: skill.icon && skill.icon.startsWith('http') ? skill.icon : ''
    });
    setIconPreview(skill.icon);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            'x-auth-token': token
          }
        };

        await axios.delete(`${API_URL}/api/skills/${id}`, config);
        toast.success('Skill deleted successfully');
        fetchSkills();
      } catch (err) {
        toast.error('Failed to delete skill');
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
    data.append('name', formData.name);
    data.append('category', formData.category);
    data.append('level', formData.level);
    data.append('description', formData.description);
    data.append('highlight', formData.highlight);
    data.append('iconUrl', formData.iconUrl);
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

      if (currentSkill) {
        await axios.put(`${API_URL}/api/skills/${currentSkill._id}`, data, config);
        toast.success('Skill updated successfully');
      } else {
        await axios.post(`${API_URL}/api/skills`, data, config);
        toast.success('Skill added successfully');
      }

      setShowForm(false);
      fetchSkills();
      navigate('/skills');
    } catch (err) {
      toast.error('Failed to save skill');
    }
  };

  const cancelForm = () => {
    setShowForm(false);
    if (id) {
      navigate('/skills');
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
                  {currentSkill ? 'Edit' : 'Create'} <span className="text-blue-500">Skill</span>
                </h1>
                <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-1">Skill Configuration</p>
              </div>
            </div>
            <button
              onClick={onSubmit}
              className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center gap-3"
            >
              <FaSave /> Save Skill
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-[#0d0d0f] border border-white/5 p-8 rounded-[2rem] space-y-6">
                <div>
                  <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-3">Skill Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={onChange}
                    placeholder="e.g. Python, TensorFlow, React"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-bold"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-3">Category</label>
                    <div className="relative">
                      <FaLayerGroup className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600" />
                      <input
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={onChange}
                        placeholder="e.g. AI/ML, Frontend"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all text-sm font-bold"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-3">Proficiency Level</label>
                    <div className="relative">
                      <FaTachometerAlt className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600" />
                      <select
                        name="level"
                        value={formData.level}
                        onChange={onChange}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all text-sm font-bold appearance-none"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Expert">Expert</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-3">Brief Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={onChange}
                    rows="4"
                    placeholder="Briefly explain your experience with this tech..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-medium leading-relaxed"
                  ></textarea>
                </div>

                <div className="flex items-center gap-4 bg-white/5 p-6 rounded-2xl border border-white/10">
                  <div className="relative inline-block w-12 h-6 transition duration-200 ease-in">
                    <input
                      type="checkbox"
                      name="highlight"
                      id="highlight"
                      checked={formData.highlight}
                      onChange={(e) => setFormData({ ...formData, highlight: e.target.checked })}
                      className="absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 checked:bg-blue-600 transition-all"
                    />
                    <label
                      htmlFor="highlight"
                      className="block overflow-hidden h-6 rounded-full bg-gray-700 cursor-pointer"
                    ></label>
                  </div>
                  <div>
                    <span className="text-white font-black text-xs uppercase tracking-widest block">Highlight Skill</span>
                    <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Make this skill stand out on the frontend</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-[#0d0d0f] border border-white/5 p-8 rounded-[2rem] space-y-6">
                <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-3 text-center">Skill Icon</label>

                <div className="space-y-6">
                  {/* Upload Option */}
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-32 h-32 rounded-[1.5rem] bg-white/5 border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden group hover:border-blue-500/50 transition-all">
                      {iconPreview ? (
                        <img src={getImageUrl(iconPreview)} alt="Icon" className="w-16 h-16 object-contain" />
                      ) : (
                        <FaTools className="text-4xl text-gray-700" />
                      )}
                    </div>
                    <label className="w-full px-6 py-3 bg-white/5 hover:bg-blue-600 text-white border border-white/10 hover:border-blue-500 rounded-xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest cursor-pointer transition-all">
                      <FaCloudUploadAlt size={16} /> Upload Photo
                      <input type="file" onChange={handleIconChange} className="hidden" />
                    </label>
                  </div>

                  <div className="relative flex items-center py-2">
                    <div className="flex-grow border-t border-white/5"></div>
                    <span className="flex-shrink mx-4 text-gray-600 text-[10px] font-black uppercase tracking-widest">OR</span>
                    <div className="flex-grow border-t border-white/5"></div>
                  </div>

                  {/* URL Option */}
                  <div>
                    <label className="block text-gray-500 text-[9px] font-black uppercase tracking-widest mb-2">Icon URL (Flaticon/External)</label>
                    <div className="relative group">
                      <FaLink className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-500 transition-colors" />
                      <input
                        type="text"
                        name="iconUrl"
                        value={formData.iconUrl}
                        onChange={onChange}
                        placeholder="https://cdn-icons-png.flaticon.com/..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-all text-[11px] font-medium"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-16">
            <div>
              <h1 className="text-4xl font-black text-white tracking-tighter">Skills <span className="text-blue-500">Expertise</span></h1>
              <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-2">Manage your technical proficiency</p>
            </div>
            <button
              onClick={handleAdd}
              className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center gap-3"
            >
              <FaPlus /> Add New Skill
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {skills.map((skill) => (
              <div key={skill._id} className={`bg-[#0d0d0f] border ${skill.highlight ? 'border-blue-500/50 shadow-lg shadow-blue-500/10' : 'border-white/5'} rounded-[2rem] p-8 group hover:border-blue-500/30 transition-all duration-500 flex flex-col h-full relative overflow-hidden`}>
                {skill.highlight && (
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/10 rounded-full -mr-12 -mt-12 animate-pulse"></div>
                )}
                <div className="flex justify-between items-start mb-8 relative z-10">
                  <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-500">
                    {skill.icon ? (
                      <img src={getImageUrl(skill.icon)} alt={skill.name} className="w-8 h-8 object-contain" />
                    ) : (
                      <span className="text-blue-500 font-black text-xl">{skill.name.charAt(0)}</span>
                    )}
                  </div>
                  <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border ${skill.level === 'Expert' ? 'text-purple-400 border-purple-500/30 bg-purple-500/10' :
                    skill.level === 'Advanced' ? 'text-blue-400 border-blue-500/30 bg-blue-500/10' :
                      'text-gray-400 border-white/10 bg-white/5'
                    }`}>
                    {skill.level}
                  </span>
                </div>

                <div className="flex-grow">
                  <h3 className="text-xl font-black text-white mb-2 group-hover:text-blue-500 transition-colors tracking-tight">{skill.name}</h3>
                  <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-4">{skill.category}</p>
                  <p className="text-gray-400 text-xs font-medium line-clamp-2 leading-relaxed">{skill.description || 'No description provided.'}</p>
                </div>

                <div className="flex gap-3 pt-8 mt-auto border-t border-white/5 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                  <button
                    onClick={() => handleEdit(skill)}
                    className="flex-1 bg-white/5 hover:bg-blue-600 text-white font-black uppercase tracking-widest text-[9px] py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(skill._id)}
                    className="w-10 h-10 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white rounded-xl transition-all flex items-center justify-center"
                  >
                    <FaTrash size={12} />
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

export default SkillsManager;
