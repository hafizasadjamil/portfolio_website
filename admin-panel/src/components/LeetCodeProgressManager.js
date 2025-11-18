import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaArrowLeft, FaSave, FaTimes } from 'react-icons/fa';

const LeetCodeProgressManager = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [currentProblem, setCurrentProblem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    difficulty: 'Easy',
    tags: '',
    status: 'Solved',
    solutionLink: '',
    dateSolved: '',
    notes: ''
  });
  
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchProblem(id);
    } else {
      fetchProblems();
    }
  }, [id]);

  const fetchProblems = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token
        }
      };
      
      const res = await axios.get('/api/leetcode-progress', config);
      setProblems(res.data);
      setLoading(false);
    } catch (err) {
      toast.error('Failed to fetch LeetCode progress');
      setLoading(false);
    }
  };

  const fetchProblem = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token
        }
      };
      
      const res = await axios.get(`/api/leetcode-progress/${id}`, config);
      const problem = res.data;
      
      setFormData({
        title: problem.title,
        difficulty: problem.difficulty,
        tags: problem.tags.join(', '),
        status: problem.status,
        solutionLink: problem.solutionLink,
        dateSolved: problem.dateSolved.split('T')[0],
        notes: problem.notes
      });
      
      setCurrentProblem(problem);
      setShowForm(true);
      setLoading(false);
    } catch (err) {
      toast.error('Failed to fetch LeetCode problem');
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setCurrentProblem(null);
    setFormData({
      title: '',
      difficulty: 'Easy',
      tags: '',
      status: 'Solved',
      solutionLink: '',
      dateSolved: new Date().toISOString().split('T')[0],
      notes: ''
    });
    setShowForm(true);
  };

  const handleEdit = (problem) => {
    setCurrentProblem(problem);
    setFormData({
      title: problem.title,
      difficulty: problem.difficulty,
      tags: problem.tags.join(', '),
      status: problem.status,
      solutionLink: problem.solutionLink,
      dateSolved: problem.dateSolved.split('T')[0],
      notes: problem.notes
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this LeetCode problem?')) {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            'x-auth-token': token
          }
        };
        
        await axios.delete(`/api/leetcode-progress/${id}`, config);
        toast.success('LeetCode problem deleted successfully');
        fetchProblems();
      } catch (err) {
        toast.error('Failed to delete LeetCode problem');
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
      
      const data = {
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map(item => item.trim()) : []
      };
      
      if (currentProblem) {
        await axios.put(`/api/leetcode-progress/${currentProblem._id}`, data, config);
        toast.success('LeetCode problem updated successfully');
      } else {
        await axios.post('/api/leetcode-progress', data, config);
        toast.success('LeetCode problem added successfully');
      }
      
      setShowForm(false);
      fetchProblems();
      navigate('/leetcode-progress');
    } catch (err) {
      toast.error('Failed to save LeetCode problem');
    }
  };

  const cancelForm = () => {
    setShowForm(false);
    if (id) {
      navigate('/leetcode-progress');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-xl">Loading LeetCode progress...</div>
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
              {currentProblem ? 'Edit LeetCode Problem' : 'Add New LeetCode Problem'}
            </h1>
          </div>
          
          <form onSubmit={onSubmit} className="bg-white rounded-lg shadow p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                  Problem Title
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
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="difficulty">
                  Difficulty
                </label>
                <select
                  id="difficulty"
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={onChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={onChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="Solved">Solved</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Attempted">Attempted</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dateSolved">
                  Date Solved
                </label>
                <input
                  type="date"
                  id="dateSolved"
                  name="dateSolved"
                  value={formData.dateSolved}
                  onChange={onChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
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
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="solutionLink">
                Solution Link (GitHub)
              </label>
              <input
                type="text"
                id="solutionLink"
                name="solutionLink"
                value={formData.solutionLink}
                onChange={onChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="notes">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
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
            <h1 className="text-2xl font-bold">LeetCode Progress</h1>
            <button onClick={handleAdd} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition flex items-center">
              <FaPlus className="mr-2" /> Add Problem
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {problems.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Difficulty
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date Solved
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {problems.map((problem) => (
                    <tr key={problem._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{problem.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          problem.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                          problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {problem.difficulty}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          problem.status === 'Solved' ? 'bg-green-100 text-green-800' :
                          problem.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {problem.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(problem.dateSolved).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(problem)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(problem._id)}
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
                <p className="text-gray-500 mb-4">No LeetCode problems found</p>
                <button onClick={handleAdd} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition">
                  Add Your First Problem
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LeetCodeProgressManager;