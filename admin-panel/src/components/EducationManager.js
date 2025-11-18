import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaArrowLeft, FaSave, FaTimes } from 'react-icons/fa';

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
      
      const res = await axios.get('/api/education', config);
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
      
      const res = await axios.get(`/api/education/${id}`, config);
      const edu = res.data;
      
      setFormData({
        institution: edu.institution,
        degree: edu.degree,
        field: edu.field,
        startDate: edu.startDate.split('T')[0],
        endDate: edu.endDate.split('T')[0],
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
      endDate: edu.endDate.split('T')[0],
      description: edu.description
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this education entry?')) {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            'x-auth-token': token
          }
        };
        
        await axios.delete(`/api/education/${id}`, config);
        toast.success('Education entry deleted successfully');
        fetchEducationList();
      } catch (err) {
        toast.error('Failed to delete education entry');
      }
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
    
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token
        }
      };
      
      if (currentEducation) {
        await axios.put(`/api/education/${currentEducation._id}`, formData, config);
        toast.success('Education updated successfully');
      } else {
        await axios.post('/api/education', formData, config);
        toast.success('Education added successfully');
      }
      
      setShowForm(false);
      fetchEducationList();
      navigate('/education');
    } catch (err) {
      toast.error('Failed to save education');
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
      <div className="flex items-center justify-center h-full">
        <div className="text-xl">Loading education...</div>
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
              {currentEducation ? 'Edit Education' : 'Add New Education'}
            </h1>
          </div>
          
          <form onSubmit={onSubmit} className="bg-white rounded-lg shadow p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="institution">
                  Institution
                </label>
                <input
                  type="text"
                  id="institution"
                  name="institution"
                  value={formData.institution}
                  onChange={onChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="degree">
                  Degree
                </label>
                <input
                  type="text"
                  id="degree"
                  name="degree"
                  value={formData.degree}
                  onChange={onChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="field">
                Field of Study
              </label>
              <input
                type="text"
                id="field"
                name="field"
                value={formData.field}
                onChange={onChange}
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="startDate">
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={onChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="endDate">
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={onChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
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
            <h1 className="text-2xl font-bold">Education</h1>
            <button onClick={handleAdd} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition flex items-center">
              <FaPlus className="mr-2" /> Add Education
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {education.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Institution
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Degree
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Field
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dates
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {education.map((edu) => (
                    <tr key={edu._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{edu.institution}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{edu.degree}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{edu.field}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(edu.startDate).getFullYear()} - {new Date(edu.endDate).getFullYear()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(edu)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(edu._id)}
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
                <p className="text-gray-500 mb-4">No education entries found</p>
                <button onClick={handleAdd} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition">
                  Add Your First Education Entry
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EducationManager;