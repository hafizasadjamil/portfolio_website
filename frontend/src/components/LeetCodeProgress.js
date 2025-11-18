import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FaFilter, FaSearch, FaGithub, FaCalendar, FaCheck, FaClock, FaTimes } from 'react-icons/fa';

const LeetCodeProgress = () => {
  const [problems, setProblems] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    difficulty: '',
    status: '',
    search: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [problemsRes, statsRes] = await Promise.all([
          axios.get('/api/leetcode-progress'),
          axios.get('/api/leetcode-progress/stats')
        ]);
        
        setProblems(problemsRes.data);
        setStats(statsRes.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const filteredProblems = problems.filter(problem => {
    return (
      (filters.difficulty === '' || problem.difficulty === filters.difficulty) &&
      (filters.status === '' || problem.status === filters.status) &&
      (filters.search === '' || 
        problem.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        problem.tags.some(tag => tag.toLowerCase().includes(filters.search.toLowerCase()))
      )
    );
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Solved': return 'text-green-400';
      case 'In Progress': return 'text-yellow-400';
      case 'Attempted': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Solved': return <FaCheck />;
      case 'In Progress': return <FaClock />;
      case 'Attempted': return <FaTimes />;
      default: return null;
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400';
      case 'Medium': return 'text-yellow-400';
      case 'Hard': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <section id="leetcode-progress" className="py-20 bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-white">LeetCode Progress</h2>
        
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <motion.div
              className="bg-gray-900 rounded-xl p-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="text-3xl font-bold text-blue-400 mb-2">{stats.total}</div>
              <div className="text-gray-400">Total Problems</div>
            </motion.div>
            
            <motion.div
              className="bg-gray-900 rounded-xl p-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-3xl font-bold text-green-400 mb-2">{stats.solved}</div>
              <div className="text-gray-400">Solved</div>
            </motion.div>
            
            <motion.div
              className="bg-gray-900 rounded-xl p-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-3xl font-bold text-yellow-400 mb-2">{stats.inProgress}</div>
              <div className="text-gray-400">In Progress</div>
            </motion.div>
            
            <motion.div
              className="bg-gray-900 rounded-xl p-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="text-3xl font-bold text-red-400 mb-2">{stats.attempted}</div>
              <div className="text-gray-400">Attempted</div>
            </motion.div>
          </div>
        )}
        
        <div className="bg-gray-900 rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search problems or tags..."
                className="w-full bg-gray-800 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
            
            <select
              name="difficulty"
              value={filters.difficulty}
              onChange={handleFilterChange}
              className="bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
            
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="Solved">Solved</option>
              <option value="In Progress">In Progress</option>
              <option value="Attempted">Attempted</option>
            </select>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center">
            <div className="text-xl text-white">Loading...</div>
          </div>
        ) : (
          <div className="bg-gray-900 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-800">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Problem
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Difficulty
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Date Solved
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Solution
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {filteredProblems.map((problem, index) => (
                    <motion.tr
                      key={problem._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-800"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-white">{problem.title}</div>
                          <div className="text-sm text-gray-400">
                            {problem.tags.map((tag, idx) => (
                              <span key={idx} className="mr-2">#{tag}</span>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${getDifficultyColor(problem.difficulty)}`}>
                          {problem.difficulty}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`flex items-center ${getStatusColor(problem.status)}`}>
                          {getStatusIcon(problem.status)}
                          <span className="ml-2 text-sm">{problem.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {formatDate(problem.dateSolved)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {problem.solutionLink ? (
                          <a
                            href={problem.solutionLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300"
                          >
                            <FaGithub />
                          </a>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredProblems.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400">No problems found matching your filters</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default LeetCodeProgress;