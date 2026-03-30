import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaArrowLeft, FaSave, FaTimes, FaCloudUploadAlt, FaGraduationCap, FaAward, FaCalendarAlt, FaLink, FaIdBadge } from 'react-icons/fa';
import { motion } from 'framer-motion';

const CoursesCertificationsManager = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    provider: '',
    type: 'Course',
    date: '',
    certificateLink: '',
    credentialId: '',
    description: '',
    skillsLearnt: ''
  });
  const [badgeImage, setBadgeImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  
  const { id } = useParams();
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (id) {
      fetchCourse(id);
    } else {
      fetchCourses();
    }
  }, [id]);

  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http') || url.startsWith('blob:')) return url;
    const cleanUrl = url.startsWith('/') ? url.substring(1) : url;
    return `${API_URL}/${cleanUrl}`;
  };

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token
        }
      };
      
      const res = await axios.get(`${API_URL}/api/course-certifications`, config);
      setCourses(res.data);
      setLoading(false);
    } catch (err) {
      toast.error('Failed to fetch courses/certifications');
      setLoading(false);
    }
  };

  const fetchCourse = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token
        }
      };
      
      const res = await axios.get(`${API_URL}/api/course-certifications/${id}`, config);
      const course = res.data;
      
      setFormData({
        title: course.title,
        provider: course.provider,
        type: course.type,
        date: course.date.split('T')[0],
        certificateLink: course.certificateLink,
        credentialId: course.credentialId,
        description: course.description,
        skillsLearnt: course.skillsLearnt.join(', ')
      });
      
      setImagePreview(course.badgeImage);
      setCurrentCourse(course);
      setShowForm(true);
      setLoading(false);
    } catch (err) {
      toast.error('Failed to fetch course/certification');
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setCurrentCourse(null);
    setFormData({
      title: '',
      provider: '',
      type: 'Course',
      date: '',
      certificateLink: '',
      credentialId: '',
      description: '',
      skillsLearnt: ''
    });
    setBadgeImage(null);
    setImagePreview('');
    setShowForm(true);
  };

  const handleEdit = (course) => {
    setCurrentCourse(course);
    setFormData({
      title: course.title,
      provider: course.provider,
      type: course.type,
      date: course.date.split('T')[0],
      certificateLink: course.certificateLink,
      credentialId: course.credentialId,
      description: course.description,
      skillsLearnt: course.skillsLearnt.join(', ')
    });
    setImagePreview(course.badgeImage);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this?')) {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            'x-auth-token': token
          }
        };
        
        await axios.delete(`${API_URL}/api/course-certifications/${id}`, config);
        toast.success('Deleted successfully');
        fetchCourses();
      } catch (err) {
        toast.error('Failed to delete');
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBadgeImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append('title', formData.title);
    data.append('provider', formData.provider);
    data.append('type', formData.type);
    data.append('date', formData.date);
    data.append('certificateLink', formData.certificateLink);
    data.append('credentialId', formData.credentialId);
    data.append('description', formData.description);
    data.append('skillsLearnt', formData.skillsLearnt);
    if (badgeImage) {
      data.append('badgeImage', badgeImage);
    }

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token,
          'Content-Type': 'multipart/form-data'
        }
      };

      if (currentCourse) {
        await axios.put(`${API_URL}/api/course-certifications/${currentCourse._id}`, data, config);
        toast.success('Updated successfully');
      } else {
        await axios.post(`${API_URL}/api/course-certifications`, data, config);
        toast.success('Added successfully');
      }
      
      setShowForm(false);
      fetchCourses();
      navigate('/course-certifications');
    } catch (err) {
      toast.error('Failed to save');
    }
  };

  const cancelForm = () => {
    setShowForm(false);
    if (id) {
      navigate('/course-certifications');
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
                  {currentCourse ? 'Edit' : 'Add'} <span className="text-blue-500">Credential</span>
                </h1>
                <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-1">Academic & Professional Records</p>
              </div>
            </div>
            <button 
              onClick={onSubmit}
              className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center gap-3"
            >
              <FaSave /> Save Record
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-[#0d0d0f] border border-white/5 p-8 rounded-[2rem] space-y-6">
                <div>
                  <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-3">Program Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={onChange}
                    placeholder="e.g. Machine Learning Specialization"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-bold"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-3">Provider / Institution</label>
                    <div className="relative">
                      <FaGraduationCap className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600" />
                      <input
                        type="text"
                        name="provider"
                        value={formData.provider}
                        onChange={onChange}
                        placeholder="e.g. Coursera, DeepLearning.AI"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all text-sm font-bold"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-3">Credential Type</label>
                    <div className="relative">
                      <FaAward className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600" />
                      <select
                        name="type"
                        value={formData.type}
                        onChange={onChange}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all text-sm font-bold appearance-none"
                      >
                        <option value="Course">Course</option>
                        <option value="Certification">Certification</option>
                        <option value="Degree">Degree</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-3">Completion Date</label>
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
                    <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-3">Credential ID</label>
                    <div className="relative">
                      <FaIdBadge className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600" />
                      <input
                        type="text"
                        name="credentialId"
                        value={formData.credentialId}
                        onChange={onChange}
                        placeholder="e.g. ABC-123-XYZ"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all text-sm font-bold"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-3">Verification Link</label>
                  <div className="relative">
                    <FaLink className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600" />
                    <input
                      type="text"
                      name="certificateLink"
                      value={formData.certificateLink}
                      onChange={onChange}
                      placeholder="https://verify.credential.net/..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all text-sm font-bold"
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
                    placeholder="Briefly explain what you learned..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-medium leading-relaxed"
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-[#0d0d0f] border border-white/5 p-8 rounded-[2rem] space-y-6">
                <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-3 text-center">Badge / Logo</label>
                <div className="flex flex-col items-center gap-6">
                  <div className="w-32 h-32 rounded-[1.5rem] bg-white/5 border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden group hover:border-blue-500/50 transition-all">
                    {imagePreview ? (
                      <img src={getImageUrl(imagePreview)} alt="Badge" className="w-20 h-20 object-contain" />
                    ) : (
                      <FaAward className="text-4xl text-gray-700" />
                    )}
                  </div>
                  <label className="w-full px-6 py-3 bg-white/5 hover:bg-blue-600 text-white border border-white/10 hover:border-blue-500 rounded-xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest cursor-pointer transition-all">
                    <FaCloudUploadAlt size={16} /> Choose Image
                    <input type="file" onChange={handleImageChange} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="bg-[#0d0d0f] border border-white/5 p-8 rounded-[2rem]">
                <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-4">Skills Learnt</label>
                <input
                  type="text"
                  name="skillsLearnt"
                  value={formData.skillsLearnt}
                  onChange={onChange}
                  placeholder="e.g. Deep Learning, NLP, Python"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all text-sm font-bold mb-4"
                />
                <div className="flex flex-wrap gap-2">
                  {formData.skillsLearnt.split(',').map((skill, i) => skill.trim() && (
                    <span key={i} className="bg-blue-600/10 text-blue-400 text-[9px] px-3 py-1.5 rounded-lg border border-blue-500/20 font-black uppercase tracking-widest">
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-16">
            <div>
              <h1 className="text-4xl font-black text-white tracking-tighter">Academic <span className="text-blue-500">Vault</span></h1>
              <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-2">Manage your certifications and courses</p>
            </div>
            <button 
              onClick={handleAdd}
              className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center gap-3"
            >
              <FaPlus /> Add Credential
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div key={course._id} className="bg-[#0d0d0f] border border-white/5 rounded-[2.5rem] p-10 group hover:border-blue-500/30 transition-all duration-500 flex flex-col h-full relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:bg-blue-500/10 transition-all duration-700"></div>
                
                <div className="flex justify-between items-start mb-8 relative z-10">
                  <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-500">
                    {course.badgeImage ? (
                      <img src={getImageUrl(course.badgeImage)} alt={course.title} className="w-10 h-10 object-contain" />
                    ) : (
                      <FaAward className="text-blue-500 text-2xl" />
                    )}
                  </div>
                  <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-lg border ${
                    course.type === 'Certification' ? 'text-purple-400 border-purple-500/30 bg-purple-500/10' :
                    course.type === 'Degree' ? 'text-blue-400 border-blue-500/30 bg-blue-500/10' :
                    'text-gray-400 border-white/10 bg-white/5'
                  }`}>
                    {course.type}
                  </span>
                </div>
                
                <div className="flex-grow relative z-10">
                  <h3 className="text-2xl font-black text-white mb-2 group-hover:text-blue-500 transition-colors tracking-tight leading-none">{course.title}</h3>
                  <p className="text-blue-500/60 text-[10px] font-black uppercase tracking-widest mb-4">{course.provider}</p>
                  <p className="text-gray-500 text-sm font-medium line-clamp-2 leading-relaxed">{course.description}</p>
                </div>

                <div className="flex gap-4 pt-8 mt-10 border-t border-white/5 relative z-10">
                  <button 
                    onClick={() => handleEdit(course)}
                    className="flex-1 bg-white/5 hover:bg-blue-600 text-white font-black uppercase tracking-widest text-[10px] py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(course._id)}
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

export default CoursesCertificationsManager;
