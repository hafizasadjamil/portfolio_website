import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaArrowLeft, FaSave, FaTimes } from 'react-icons/fa';

const SkillsManager = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [currentSkill, setCurrentSkill] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    level: 'Intermediate',
    description: ''
  });
  const [icon, setIcon] = useState(null);
  const [iconPreview, setIconPreview] = useState('');
  
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchSkill(id);
    } else {
      fetchSkills();
    }
  }, [id]);

  const fetchSkills = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token
        }
      };
      
      const res = await axios.get('/api/skills', config);
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
      
      const res = await axios.get(`/api/skills/${id}`, config);
      const skill = res.data;
      
      setFormData({
        name: skill.name,
        category: skill.category,
        level: skill.level,
        description: skill.description
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
      description: ''
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
      description: skill.description
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
        
        await axios.delete(`/api/skills/${id}`, config);
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
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append('name', formData.name);
    data.append('category', formData.category);
    data.append('level', formData.level);
    data.append('description', formData.description);
    
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
        await axios.put(`/api/skills/${currentSkill._id}`, data, config);
        toast.success('Skill updated successfully');
      } else {
        await axios.post('/api/skills', data, config);
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
      <div className="flex items-center justify-center h-full">
        <div className="text-xl">Loading skills...</div>
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
              {currentSkill ? 'Edit Skill' : 'Add New Skill'}
            </h1>
          </div>
          
          <form onSubmit={onSubmit} className="bg-white rounded-lg shadow p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                  Skill Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={onChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
                  Category
                </label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={onChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="level">
                Level
              </label>
              <select
                id="level"
                name="level"
                value={formData.level}
                onChange={onChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
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
                rows="3"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              ></textarea>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="icon">
                Icon
              </label>
              <input
                type="file"
                id="icon"
                onChange={handleIconChange}
                accept="image/*"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              
              {iconPreview && (
                <div className="mt-4">
                  <img 
                    src={iconPreview} 
                    alt="Preview" 
                    className="w-16 h-16 object-cover rounded"
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
            <h1 className="text-2xl font-bold">Skills</h1>
            <button onClick={handleAdd} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition flex items-center">
              <FaPlus className="mr-2" /> Add Skill
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {skills.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Level
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {skills.map((skill) => (
                    <tr key={skill._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {skill.icon && (
                            <img src={skill.icon} alt={skill.name} className="w-8 h-8 mr-3" />
                          )}
                          <div className="text-sm font-medium text-gray-900">{skill.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{skill.category}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          skill.level === 'Beginner' ? 'bg-green-100 text-green-800' :
                          skill.level === 'Intermediate' ? 'bg-blue-100 text-blue-800' :
                          skill.level === 'Advanced' ? 'bg-purple-100 text-purple-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {skill.level}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(skill)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(skill._id)}
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
                <p className="text-gray-500 mb-4">No skills found</p>
                <button onClick={handleAdd} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition">
                  Add Your First Skill
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillsManager;