import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaArrowLeft, FaSave, FaTimes, FaCloudUploadAlt, FaRocket, FaCode, FaLink } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ProjectsManager = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    techStack: '',
    githubUrl: '',
    demoUrl: '',
    featured: false
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const { id } = useParams();
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (id) {
      fetchProject(id);
    } else {
      fetchProjects();
    }
  }, [id]);

  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http') || url.startsWith('blob:')) return url;
    const cleanUrl = url.startsWith('/') ? url.substring(1) : url;
    return `${API_URL}/${cleanUrl}`;
  };

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token
        }
      };

      const res = await axios.get(`${API_URL}/api/projects`, config);
      setProjects(res.data);
      setLoading(false);
    } catch (err) {
      toast.error('Failed to fetch projects');
      setLoading(false);
    }
  };

  const fetchProject = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token
        }
      };

      const res = await axios.get(`${API_URL}/api/projects/${id}`, config);
      const project = res.data;

      setFormData({
        title: project.title,
        description: project.description,
        techStack: project.techStack.join(', '),
        githubUrl: project.githubUrl,
        demoUrl: project.demoUrl,
        featured: project.featured
      });

      if (project.images && project.images.length > 0) {
        setImagePreviews(project.images);
      } else if (project.image) {
        setImagePreviews([project.image]);
      } else {
        setImagePreviews([]);
      }

      setCurrentProject(project);
      setShowForm(true);
      setLoading(false);
    } catch (err) {
      toast.error('Failed to fetch project');
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setCurrentProject(null);
    setFormData({
      title: '',
      description: '',
      techStack: '',
      githubUrl: '',
      demoUrl: '',
      featured: false
    });
    setImages([]);
    setImagePreviews([]);
    setShowForm(true);
  };

  const handleEdit = (project) => {
    setCurrentProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      techStack: project.techStack.join(', '),
      githubUrl: project.githubUrl,
      demoUrl: project.demoUrl,
      featured: project.featured
    });

    if (project.images && project.images.length > 0) {
      setImagePreviews(project.images);
    } else if (project.image) {
      setImagePreviews([project.image]);
    } else {
      setImagePreviews([]);
    }

    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            'x-auth-token': token
          }
        };

        await axios.delete(`${API_URL}/api/projects/${id}`, config);
        toast.success('Project deleted successfully');
        fetchProjects();
      } catch (err) {
        toast.error('Failed to delete project');
      }
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setImages(prevImages => [...prevImages, ...files]);
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
    }
  };

  const removePreview = (index) => {
    const previewToRemove = imagePreviews[index];

    if (previewToRemove.startsWith('blob:')) {
      const blobIndex = imagePreviews.filter((p, i) => i < index && p.startsWith('blob:')).length;
      const newImages = [...images];
      newImages.splice(blobIndex, 1);
      setImages(newImages);
    }

    const newPreviews = [...imagePreviews];
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  };

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('techStack', formData.techStack);
    data.append('githubUrl', formData.githubUrl);
    data.append('demoUrl', formData.demoUrl);
    data.append('featured', formData.featured);

    if (images.length > 0) {
      images.forEach(img => {
        data.append('images', img);
      });
    }

    const existingImages = imagePreviews.filter(p => !p.startsWith('blob:'));
    data.append('existingImages', JSON.stringify(existingImages));

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token,
          'Content-Type': 'multipart/form-data'
        }
      };

      if (currentProject) {
        await axios.put(`${API_URL}/api/projects/${currentProject._id}`, data, config);
        toast.success('Project updated successfully');
      } else {
        await axios.post(`${API_URL}/api/projects`, data, config);
        toast.success('Project added successfully');
      }

      setShowForm(false);
      fetchProjects();
      navigate('/projects');
    } catch (err) {
      toast.error('Failed to save project');
    }
  };

  const cancelForm = () => {
    setShowForm(false);
    if (id) {
      navigate('/projects');
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
                  {currentProject ? 'Edit' : 'Create'} <span className="text-blue-500">Project</span>
                </h1>
                <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-1">Project Configuration</p>
              </div>
            </div>
            <button
              onClick={onSubmit}
              className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center gap-3"
            >
              <FaSave /> Save Changes
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-[#0d0d0f] border border-white/5 p-8 rounded-[2rem] space-y-6">
                <div>
                  <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-3">Project Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={onChange}
                    placeholder="e.g. AI Automation Engine"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-bold"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-3">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={onChange}
                    rows="6"
                    placeholder="Describe the magic behind this project..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-medium leading-relaxed"
                  ></textarea>
                </div>
              </div>

              <div className="bg-[#0d0d0f] border border-white/5 p-8 rounded-[2rem] space-y-6">
                <h3 className="text-white font-black uppercase tracking-widest text-xs flex items-center gap-3">
                  <FaLink className="text-blue-500" /> Links & Visibility
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-3">GitHub URL</label>
                    <div className="relative">
                      <FaCode className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600" />
                      <input
                        type="text"
                        name="githubUrl"
                        value={formData.githubUrl}
                        onChange={onChange}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all text-sm font-bold"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-3">Live Demo URL</label>
                    <div className="relative">
                      <FaRocket className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600" />
                      <input
                        type="text"
                        name="demoUrl"
                        value={formData.demoUrl}
                        onChange={onChange}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all text-sm font-bold"
                      />
                    </div>
                  </div>
                </div>
                <label className="flex items-center gap-4 cursor-pointer group bg-white/5 p-4 rounded-2xl border border-white/10 hover:border-blue-500/30 transition-all">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={onChange}
                    className="w-6 h-6 rounded-lg bg-white/5 border-white/10 text-blue-600 focus:ring-0 focus:ring-offset-0"
                  />
                  <span className="text-white font-bold text-sm">Feature this project on homepage</span>
                </label>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-[#0d0d0f] border border-white/5 p-8 rounded-[2rem] space-y-6">
                <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-3 text-center">Project Gallery</label>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative aspect-square rounded-2xl overflow-hidden group border border-white/10">
                      <img src={getImageUrl(preview)} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removePreview(index)}
                        className="absolute top-2 right-2 w-8 h-8 bg-red-600 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                      >
                        <FaTimes size={12} />
                      </button>
                    </div>
                  ))}
                  <label className="aspect-square rounded-2xl border-2 border-dashed border-white/10 hover:border-blue-500/50 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all hover:bg-blue-600/5 group">
                    <FaCloudUploadAlt className="text-2xl text-gray-600 group-hover:text-blue-500 transition-colors" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-gray-600 group-hover:text-blue-400">Upload</span>
                    <input type="file" multiple onChange={handleImageChange} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="bg-[#0d0d0f] border border-white/5 p-8 rounded-[2rem]">
                <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-4">Tech Stack</label>
                <input
                  type="text"
                  name="techStack"
                  value={formData.techStack}
                  onChange={onChange}
                  placeholder="React, AI, Python..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all text-sm font-bold mb-4"
                />
                <div className="flex flex-wrap gap-2">
                  {formData.techStack.split(',').map((tech, i) => tech.trim() && (
                    <span key={i} className="bg-blue-600/10 text-blue-400 text-[9px] px-3 py-1.5 rounded-lg border border-blue-500/20 font-black uppercase tracking-widest">
                      {tech.trim()}
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
              <h1 className="text-4xl font-black text-white tracking-tighter">Projects <span className="text-blue-500">Inventory</span></h1>
              <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-2">Manage your featured work</p>
            </div>
            <button
              onClick={handleAdd}
              className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center gap-3"
            >
              <FaPlus /> New Project
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div key={project._id} className="bg-[#0d0d0f] border border-white/5 rounded-[2.5rem] overflow-hidden group hover:border-blue-500/30 transition-all duration-500 flex flex-col h-full">
                <div className="h-48 relative overflow-hidden">
                  <img
                    src={getImageUrl(project.images?.[0] || project.image)}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0f] to-transparent"></div>
                  {project.featured && (
                    <div className="absolute top-6 right-6 bg-blue-600 text-white text-[8px] font-black px-3 py-1.5 rounded-lg uppercase tracking-[0.2em] shadow-xl">
                      Featured
                    </div>
                  )}
                </div>

                <div className="p-10 flex flex-col flex-grow">
                  <h3 className="text-2xl font-black text-white mb-4 group-hover:text-blue-500 transition-colors tracking-tight">{project.title}</h3>
                  <p className="text-gray-500 text-sm font-medium line-clamp-2 mb-8 flex-grow leading-relaxed">{project.description}</p>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {project.techStack.slice(0, 3).map((tech, i) => (
                      <span key={i} className="text-[9px] text-gray-400 font-black uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-lg">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-4 pt-8 border-t border-white/5">
                    <button
                      onClick={() => handleEdit(project)}
                      className="flex-1 bg-white/5 hover:bg-blue-600 text-white font-black uppercase tracking-widest text-[10px] py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(project._id)}
                      className="w-14 h-14 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white rounded-2xl transition-all flex items-center justify-center"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsManager;
