import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaArrowLeft, FaSave, FaTimes } from 'react-icons/fa';

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

  useEffect(() => {
    if (id) {
      fetchAchievement(id);
    } else {
      fetchAchievements();
    }
  }, [id]);

  const fetchAchievements = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token
        }
      };
      
      const res = await axios.get('/api/achievements', config);
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
      
      const res = await axios.get(`/api/achievements/${id}`, config);
      const achievement = res.data;
      
      setFormData({
        title: achievement.title,
        description: achievement.description,
        date: achievement.date.split('T')[0] // Format date for input
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
        
        await axios.delete(`/api/achievements/${id}`, config);
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
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
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
        await axios.put(`/api/achievements/${currentAchievement._id}`, data, config);
        toast.success('Achievement updated successfully');
      } else {
        await axios.post('/api/achievements', data, config);
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
      <div className="flex items-center justify-center h-full">
        <div className="text-xl">Loading achievements...</div>
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
              {currentAchievement ? 'Edit Achievement' : 'Add New Achievement'}
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
                rows="3"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              ></textarea>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
                Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={onChange}
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
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
            <h1 className="text-2xl font-bold">Achievements</h1>
            <button onClick={handleAdd} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition flex items-center">
              <FaPlus className="mr-2" /> Add Achievement
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {achievements.length > 0 ? (
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
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {achievements.map((achievement) => (
                    <tr key={achievement._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{achievement.title}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 max-w-xs truncate">{achievement.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(achievement.date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(achievement)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(achievement._id)}
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
                <p className="text-gray-500 mb-4">No achievements found</p>
                <button onClick={handleAdd} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition">
                  Add Your First Achievement
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AchievementsManager;