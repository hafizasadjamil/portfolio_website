import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaArrowLeft, FaSave, FaTimes, FaEye } from 'react-icons/fa';

const BlogManager = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
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

  useEffect(() => {
    if (id) {
      fetchBlog(id);
    } else {
      fetchBlogs();
    }
  }, [id]);

  const fetchBlogs = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token
        }
      };
      
      const res = await axios.get('/api/blog/admin', config);
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
      
      const res = await axios.get(`/api/blog/${id}`, config);
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
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            'x-auth-token': token
          }
        };
        
        await axios.delete(`/api/blog/${id}`, config);
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

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title)
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
        await axios.put(`/api/blog/${currentBlog._id}`, data, config);
        toast.success('Blog post updated successfully');
      } else {
        await axios.post('/api/blog', data, config);
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

  const togglePublish = async (id, published) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token
        }
      };
      
      await axios.put(`/api/blog/${id}`, { published: !published }, config);
      toast.success(`Blog post ${!published ? 'published' : 'unpublished'} successfully`);
      fetchBlogs();
    } catch (err) {
      toast.error('Failed to update blog post');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-xl">Loading blog posts...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {showForm ? (
        <div>
          <div className="flex items-center mb-6">
            <button onClick={cancelForm} className="mr-4 text-gray-600 hover:text-gray-900">
              <FaArrowLeft />
            </button>
            <h1 className="text-2xl font-bold">
              {currentBlog ? 'Edit Blog Post' : 'Add New Blog Post'}
            </h1>
          </div>
          
          <form onSubmit={onSubmit} className="bg-white rounded-lg shadow p-6">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleTitleChange}
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="slug">
                Slug
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={onChange}
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="excerpt">
                Excerpt
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={onChange}
                required
                rows="3"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              ></textarea>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="content">
                Content (Markdown supported)
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={onChange}
                required
                rows="10"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              ></textarea>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tags">
                Tags (comma separated)
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={onChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="published"
                  checked={formData.published}
                  onChange={onChange}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2 text-gray-700">Published</span>
              </label>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="featuredImage">
                Featured Image
              </label>
              <input
                type="file"
                id="featuredImage"
                onChange={handleImageChange}
                accept="image/*"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              
              {imagePreview && (
                <div className="mt-4">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-64 h-64 object-cover rounded"
                  />
                </div>
              )}
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={cancelForm}
                className="bg-gray-500 text-white py-2 px-4 rounded mr-2 hover:bg-gray-600 transition"
              >
                <FaTimes className="inline mr-2" /> Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
              >
                <FaSave className="inline mr-2" /> Save
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Blog Posts</h1>
            <button onClick={handleAdd} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition flex items-center">
              <FaPlus className="mr-2" /> Add Blog Post
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {blogs.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {blogs.map((blog) => (
                    <tr key={blog._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{blog.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          blog.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {blog.published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(blog.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(blog)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(blog._id)}
                          className="text-red-600 hover:text-red-900 mr-3"
                        >
                          <FaTrash />
                        </button>
                        <a
                          href={`/blog/${blog.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-900"
                        >
                          <FaEye />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No blog posts found</p>
                <button onClick={handleAdd} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition">
                  Write Your First Blog Post
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogManager;