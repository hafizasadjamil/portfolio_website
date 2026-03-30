import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaArrowLeft, FaSave, FaTimes, FaEye, FaCloudUploadAlt, FaBlog, FaLink, FaGlobe } from 'react-icons/fa';
import Markdown from 'markdown-to-jsx';
import { motion, AnimatePresence } from 'framer-motion';

const BlogManager = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [currentBlog, setCurrentBlog] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    tags: '',
    published: false
  });
  const [featuredImage, setFeaturedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const { id } = useParams();
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (id) {
      fetchBlog(id);
    } else {
      fetchBlogs();
    }
  }, [id]);

  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http') || url.startsWith('blob:')) return url;
    const cleanUrl = url.startsWith('/') ? url.substring(1) : url;
    return `${API_URL}/${cleanUrl}`;
  };

  const fetchBlogs = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token
        }
      };

      const res = await axios.get(`${API_URL}/api/blog/admin`, config);
      setBlogs(res.data);
      setLoading(false);
    } catch (err) {
      toast.error('Failed to fetch blog posts');
      setLoading(false);
    }
  };

  const fetchBlog = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token
        }
      };

      const res = await axios.get(`${API_URL}/api/blog/${id}`, config);
      const blog = res.data;

      setFormData({
        title: blog.title,
        slug: blog.slug,
        content: blog.content,
        excerpt: blog.excerpt,
        tags: blog.tags.join(', '),
        published: blog.published
      });

      setImagePreview(blog.featuredImage);
      setCurrentBlog(blog);
      setShowForm(true);
      setLoading(false);
    } catch (err) {
      toast.error('Failed to fetch blog post');
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setCurrentBlog(null);
    setFormData({
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      tags: '',
      published: false
    });
    setFeaturedImage(null);
    setImagePreview('');
    setShowForm(true);
  };

  const handleEdit = (blog) => {
    setCurrentBlog(blog);
    setFormData({
      title: blog.title,
      slug: blog.slug,
      content: blog.content,
      excerpt: blog.excerpt,
      tags: blog.tags.join(', '),
      published: blog.published
    });
    setImagePreview(blog.featuredImage);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            'x-auth-token': token
          }
        };

        await axios.delete(`${API_URL}/api/blog/${id}`, config);
        toast.success('Blog post deleted successfully');
        fetchBlogs();
      } catch (err) {
        toast.error('Failed to delete blog post');
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFeaturedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
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
    data.append('slug', formData.slug);
    data.append('content', formData.content);
    data.append('excerpt', formData.excerpt);
    data.append('tags', formData.tags);
    data.append('published', formData.published);
    if (featuredImage) {
      data.append('featuredImage', featuredImage);
    }

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token,
          'Content-Type': 'multipart/form-data'
        }
      };

      if (currentBlog) {
        await axios.put(`${API_URL}/api/blog/${currentBlog._id}`, data, config);
        toast.success('Blog post updated successfully');
      } else {
        await axios.post(`${API_URL}/api/blog`, data, config);
        toast.success('Blog post added successfully');
      }

      setShowForm(false);
      fetchBlogs();
      navigate('/blog');
    } catch (err) {
      toast.error('Failed to save blog post');
    }
  };

  const cancelForm = () => {
    setShowForm(false);
    if (id) {
      navigate('/blog');
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
          className="max-w-6xl mx-auto"
        >
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-6">
              <button onClick={cancelForm} className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all">
                <FaArrowLeft />
              </button>
              <div>
                <h1 className="text-3xl font-black text-white tracking-tighter">
                  {currentBlog ? 'Edit' : 'Create'} <span className="text-blue-500">Post</span>
                </h1>
                <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-1">Blog Engine</p>
              </div>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => setShowPreview(!showPreview)}
                className="px-6 py-4 bg-white/5 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all border border-white/10 flex items-center gap-3"
              >
                <FaEye /> {showPreview ? 'Hide' : 'Preview'}
              </button>
              <button 
                onClick={onSubmit}
                className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center gap-3"
              >
                <FaSave /> Publish
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-[#0d0d0f] border border-white/5 p-8 rounded-[2rem] space-y-6">
                <div>
                  <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-3">Article Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={onChange}
                    placeholder="Enter a compelling title..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-bold text-xl"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-3">URL Slug</label>
                    <div className="relative">
                      <FaLink className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600" />
                      <input
                        type="text"
                        name="slug"
                        value={formData.slug}
                        onChange={onChange}
                        placeholder="my-awesome-post"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all text-sm font-bold"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-3">Tags (comma separated)</label>
                    <input
                      type="text"
                      name="tags"
                      value={formData.tags}
                      onChange={onChange}
                      placeholder="AI, Future, Web3"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all text-sm font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-3">Excerpt (Short Summary)</label>
                  <textarea
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={onChange}
                    rows="3"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-medium leading-relaxed"
                  ></textarea>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest">Content (Markdown Supported)</label>
                    <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest bg-blue-500/10 px-2 py-1 rounded">Rich Text</span>
                  </div>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={onChange}
                    rows="15"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-mono text-sm leading-relaxed"
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-[#0d0d0f] border border-white/5 p-8 rounded-[2rem] space-y-6">
                <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-3 text-center">Featured Image</label>
                <div className="flex flex-col items-center gap-6">
                  <div className="w-full aspect-video rounded-[1.5rem] bg-white/5 border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden group hover:border-blue-500/50 transition-all relative">
                    {imagePreview ? (
                      <img src={getImageUrl(imagePreview)} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <FaCloudUploadAlt className="text-4xl text-gray-700" />
                    )}
                  </div>
                  <label className="w-full px-6 py-3 bg-white/5 hover:bg-blue-600 text-white border border-white/10 hover:border-blue-500 rounded-xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest cursor-pointer transition-all">
                    <FaCloudUploadAlt size={16} /> Choose Image
                    <input type="file" onChange={handleImageChange} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="bg-[#0d0d0f] border border-white/5 p-8 rounded-[2rem]">
                <label className="flex items-center gap-4 cursor-pointer group bg-white/5 p-4 rounded-2xl border border-white/10 hover:border-blue-500/30 transition-all">
                  <input
                    type="checkbox"
                    name="published"
                    checked={formData.published}
                    onChange={onChange}
                    className="w-6 h-6 rounded-lg bg-white/5 border-white/10 text-blue-600 focus:ring-0 focus:ring-offset-0"
                  />
                  <div>
                    <span className="text-white font-bold text-sm block">Make Public</span>
                    <span className="text-gray-500 text-[10px] uppercase font-black tracking-widest">Visibility Status</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {showPreview && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="mt-12 bg-[#0d0d0f] border border-white/5 p-12 rounded-[3rem] prose prose-invert max-w-none shadow-2xl"
              >
                <h1 className="text-5xl font-black mb-8 tracking-tighter">{formData.title}</h1>
                <Markdown>{formData.content}</Markdown>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-16">
            <div>
              <h1 className="text-4xl font-black text-white tracking-tighter">Blog <span className="text-blue-500">Editor</span></h1>
              <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-2">Manage your articles and thoughts</p>
            </div>
            <button 
              onClick={handleAdd}
              className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center gap-3"
            >
              <FaPlus /> New Article
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <div key={blog._id} className="bg-[#0d0d0f] border border-white/5 rounded-[2.5rem] overflow-hidden group hover:border-blue-500/30 transition-all duration-500 flex flex-col h-full">
                <div className="h-48 relative overflow-hidden">
                  <img 
                    src={getImageUrl(blog.featuredImage)} 
                    alt={blog.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0f] to-transparent"></div>
                  <div className="absolute top-6 right-6 flex gap-2">
                    {blog.published ? (
                      <span className="bg-green-600/20 text-green-400 text-[8px] font-black px-3 py-1 rounded-lg uppercase tracking-widest border border-green-500/20 backdrop-blur-md">Live</span>
                    ) : (
                      <span className="bg-yellow-600/20 text-yellow-400 text-[8px] font-black px-3 py-1 rounded-lg uppercase tracking-widest border border-yellow-500/20 backdrop-blur-md">Draft</span>
                    )}
                  </div>
                </div>
                
                <div className="p-10 flex flex-col flex-grow">
                  <h3 className="text-2xl font-black text-white mb-4 group-hover:text-blue-500 transition-colors tracking-tight line-clamp-2">{blog.title}</h3>
                  <p className="text-gray-500 text-sm font-medium line-clamp-2 mb-8 flex-grow leading-relaxed">{blog.excerpt}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-8">
                    {blog.tags.slice(0, 3).map((tag, i) => (
                      <span key={i} className="text-[9px] text-gray-400 font-black uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-lg">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-4 pt-8 border-t border-white/5">
                    <button 
                      onClick={() => handleEdit(blog)}
                      className="flex-1 bg-white/5 hover:bg-blue-600 text-white font-black uppercase tracking-widest text-[10px] py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
                    >
                      <FaEdit /> Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(blog._id)}
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

export default BlogManager;
