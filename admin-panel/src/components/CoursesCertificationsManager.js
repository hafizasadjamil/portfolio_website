import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaArrowLeft, FaSave, FaTimes } from 'react-icons/fa';

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

  useEffect(() => {
    if (id) {
      fetchCourse(id);
    } else {
      fetchCourses();
    }
  }, [id]);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token
        }
      };
      
      const res = await axios.get('/api/course-certifications', config);
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
      
      const res = await axios.get(`/api/course-certifications/${id}`, config);
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
    if (window.confirm('Are you sure you want to delete this course/certification?')) {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            'x-auth-token': token
          }
        };
        
        await axios.delete(`/api/course-certifications/${id}`, config);
        toast.success('Course/Certification deleted successfully');
        fetchCourses();
      } catch (err) {
        toast.error('Failed to delete course/certification');
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
        await axios.put(`/api/course-certifications/${currentCourse._id}`, data, config);
        toast.success('Course/Certification updated successfully');
      } else {
        await axios.post('/api/course-certifications', data, config);
        toast.success('Course/Certification added successfully');
      }
      
      setShowForm(false);
      fetchCourses();
      navigate('/course-certifications');
    } catch (err) {
      toast.error('Failed to save course/certification');
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
      <div className="flex items-center justify-center h-full">
        <div className="text-xl">Loading courses/certifications...</div>
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
              {currentCourse ? 'Edit Course/Certification' : 'Add New Course/Certification'}
            </h1>
          </div>
          
          <form onSubmit={onSubmit} className="bg-white rounded-lg shadow p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
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
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="provider">
                  Provider
                </label>
                <input
                  type="text"
                  id="provider"
                  name="provider"
                  value={formData.provider}
                  onChange={onChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type">
                  Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={onChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="Course">Course</option>
                  <option value="Certification">Certification</option>
                </select>
              </div>
              
              <div>
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
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="certificateLink">
                  Certificate Link
                </label>
                <input
                  type="text"
                  id="certificateLink"
                  name="certificateLink"
                  value={formData.certificateLink}
                  onChange={onChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="credentialId">
                  Credential ID
                </label>
                <input
                  type="text"
                  id="credentialId"
                  name="credentialId"
                  value={formData.credentialId}
                  onChange={onChange}
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
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="skillsLearnt">
                Skills Learnt (comma separated)
              </label>
              <input
                type="text"
                id="skillsLearnt"
                name="skillsLearnt"
                value={formData.skillsLearnt}
                onChange={onChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="badgeImage">
                Badge Image
              </label>
              <input
                type="file"
                id="badgeImage"
                onChange={handleImageChange}
                accept="image/*"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              
              {imagePreview && (
                <div className="mt-4">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-32 h-32 object-cover rounded"
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
            <h1 className="text-2xl font-bold">Courses & Certifications</h1>
            <button onClick={handleAdd} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition flex items-center">
              <FaPlus className="mr-2" /> Add Course/Certification
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {courses.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Provider
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
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
                  {courses.map((course) => (
                    <tr key={course._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{course.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{course.provider}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          course.type === 'Course' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                        }`}>
                          {course.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(course.date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(course)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(course._id)}
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
                <p className="text-gray-500 mb-4">No courses/certifications found</p>
                <button onClick={handleAdd} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition">
                  Add Your First Course/Certification
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursesCertificationsManager;