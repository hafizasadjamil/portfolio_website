import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaArrowLeft, FaSave, FaTimes, FaCode, FaLink, FaCalendarAlt, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';

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
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

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
      
      const res = await axios.get(`${API_URL}/api/leetcode-progress`, config);
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
      
      const res = await axios.get(`${API_URL}/api/leetcode-progress/${id}`, config);
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
    if (window.confirm('Are you sure you want to delete this problem record?')) {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            'x-auth-token': token
          }
        };
        
        await axios.delete(`${API_URL}/api/leetcode-progress/${id}`, config);
        toast.success('Deleted successfully');
        fetchProblems();
      } catch (err) {
        toast.error('Failed to delete');
      }
    }
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

      if (currentProblem) {
        await axios.put(`${API_URL}/api/leetcode-progress/${currentProblem._id}`, formData, config);
        toast.success('Updated successfully');
      } else {
        await axios.post(`${API_URL}/api/leetcode-progress`, formData, config);
        toast.success('Added successfully');
      }
      
      setShowForm(false);
      fetchProblems();
      navigate('/leetcode-progress');
    } catch (err) {
      toast.error('Failed to save');
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
                  {currentProblem ? 'Edit' : 'Add'} <span className="text-blue-500">Problem</span>
                </h1>
                <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-1">Algorithm Tracking</p>
              </div>
            </div>
            <button 
              onClick={onSubmit}
              className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center gap-3"
            >
              <FaSave /> Save Progress
            </button>
          </div>

          <div className="bg-[#0d0d0f] border border-white/5 p-10 rounded-[2.5rem] space-y-8">
            <div>
              <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-3">Problem Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={onChange}
                placeholder="e.g. 1. Two Sum"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-bold"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-3">Difficulty</label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={onChange}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all text-sm font-bold appearance-none"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-3">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={onChange}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all text-sm font-bold appearance-none"
                >
                  <option value="Solved">Solved</option>
                  <option value="Attempted">Attempted</option>
                  <option value="Todo">To Do</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-3">Date Solved</label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600" />
                  <input
                    type="date"
                    name="dateSolved"
                    value={formData.dateSolved}
                    onChange={onChange}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all text-sm font-bold"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-3">Solution / Problem Link</label>
              <div className="relative">
                <FaLink className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600" />
                <input
                  type="text"
                  name="solutionLink"
                  value={formData.solutionLink}
                  onChange={onChange}
                  placeholder="https://leetcode.com/problems/..."
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
                placeholder="Array, Hash Table, Dynamic Programming"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all text-sm font-bold"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-3">Solution Notes / Approach</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={onChange}
                rows="5"
                placeholder="Explain the logic or complexity..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-medium leading-relaxed"
              ></textarea>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-16">
            <div>
              <h1 className="text-4xl font-black text-white tracking-tighter">LeetCode <span className="text-blue-500">Progress</span></h1>
              <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-2">Track your algorithmic journey</p>
            </div>
            <button 
              onClick={handleAdd}
              className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center gap-3"
            >
              <FaPlus /> Log Problem
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {problems.map((problem) => (
              <div key={problem._id} className="bg-[#0d0d0f] border border-white/5 rounded-[2rem] p-8 group hover:border-blue-500/30 transition-all duration-500 flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border border-white/10 ${
                    problem.difficulty === 'Easy' ? 'bg-green-500/10 text-green-500' :
                    problem.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-500' :
                    'bg-red-500/10 text-red-500'
                  }`}>
                    <FaCode size={20} />
                  </div>
                  <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border ${
                    problem.status === 'Solved' ? 'text-green-400 border-green-500/30 bg-green-500/10' :
                    problem.status === 'Attempted' ? 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10' :
                    'text-gray-400 border-white/10 bg-white/5'
                  }`}>
                    {problem.status}
                  </span>
                </div>
                
                <div className="flex-grow">
                  <h3 className="text-lg font-black text-white mb-2 group-hover:text-blue-500 transition-colors tracking-tight line-clamp-2">{problem.title}</h3>
                  <p className={`text-[10px] font-black uppercase tracking-widest mb-4 ${
                    problem.difficulty === 'Easy' ? 'text-green-500/60' :
                    problem.difficulty === 'Medium' ? 'text-yellow-500/60' :
                    'text-red-500/60'
                  }`}>{problem.difficulty}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {problem.tags.slice(0, 2).map((tag, i) => (
                      <span key={i} className="text-[8px] text-gray-500 font-black uppercase tracking-widest bg-white/5 px-2 py-1 rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-6 mt-auto border-t border-white/5">
                  <button 
                    onClick={() => handleEdit(problem)}
                    className="flex-1 bg-white/5 hover:bg-blue-600 text-white font-black uppercase tracking-widest text-[9px] py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(problem._id)}
                    className="w-10 h-10 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white rounded-xl transition-all flex items-center justify-center"
                  >
                    <FaTrash size={12} />
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

export default LeetCodeProgressManager;
