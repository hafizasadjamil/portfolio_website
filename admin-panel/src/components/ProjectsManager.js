import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaArrowLeft, FaSave, FaTimes } from 'react-icons/fa';

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
    return `http://localhost:5000/${cleanUrl}`;
  };

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token
        }
      };

      const res = await axios.get('http://localhost:5000/api/projects', config);
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

      const res = await axios.get(`http://localhost:5000/api/projects/${id}`, config);
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

        await axios.delete(`http://localhost:5000/api/projects/${id}`, config);
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

    // If it's a blob URL (newly selected file)
    if (previewToRemove.startsWith('blob:')) {
      const blobIndex = imagePreviews.filter((p, i) => i < index && p.startsWith('blob:')).length;
      const newImages = [...images];
      newImages.splice(blobIndex, 1);
      setImages(newImages);
    } else {
      // It's an existing image URL from the server
      // We might want to track these to delete from server later, 
      // but for now let's just remove from the list that will be sent back
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

    // Also send existing image URLs that weren't removed
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
        await axios.put(`http://localhost:5000/api/projects/${currentProject._id}`, data, config);
        toast.success('Project updated successfully');
      } else {
        await axios.post('http://localhost:5000/api/projects', data, config);
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
      <div className="flex items-center justify-center h-full">
        <div className="text-xl">Loading projects...</div>
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
              {currentProject ? 'Edit Project' : 'Add New Project'}
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
                onChange={onChange}
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={onChange}
                required
                rows="4"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              ></textarea>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="techStack">
                Tech Stack (comma separated)
              </label>
              <input
                type="text"
                id="techStack"
                name="techStack"
                value={formData.techStack}
                onChange={onChange}
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="githubUrl">
                  GitHub URL
                </label>
                <input
                  type="text"
                  id="githubUrl"
                  name="githubUrl"
                  value={formData.githubUrl}
                  onChange={onChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="demoUrl">
                  Demo URL
                </label>
                <input
                  type="text"
                  id="demoUrl"
                  name="demoUrl"
                  value={formData.demoUrl}
                  onChange={onChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={onChange}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2 text-gray-700">Featured Project</span>
              </label>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="images">
                Project Images (Select multiple)
              </label>
              <input
                type="file"
                id="images"
                onChange={handleImageChange}
                accept="image/*"
                multiple
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />

              {imagePreviews.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={getImageUrl(preview)}
                        alt={`Preview ${index + 1}`}
                        className="w-32 h-32 object-cover rounded shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => removePreview(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FaTimes size={12} />
                      </button>
                    </div>
                  ))}
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
            <h1 className="text-2xl font-bold">Projects</h1>
            <button onClick={handleAdd} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition flex items-center">
              <FaPlus className="mr-2" /> Add Project
            </button>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            {projects.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tech Stack
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {projects.map((project) => (
                    <tr key={project._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{project.title}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 max-w-xs truncate">{project.description}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {project.techStack.slice(0, 3).map((tech, index) => (
                            <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                              {tech}
                            </span>
                          ))}
                          {project.techStack.length > 3 && (
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                              +{project.techStack.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(project)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(project._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No projects found</p>
                <button onClick={handleAdd} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition">
                  Add Your First Project
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsManager;