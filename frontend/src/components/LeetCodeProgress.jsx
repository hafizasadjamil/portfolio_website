import React, { useEffect, useState } from 'react';
import usePageTitle from '../hooks/usePageTitle';
import api from '../services/api';
import { FaSearch, FaGithub, FaCheck, FaClock, FaTimes } from 'react-icons/fa';

const LeetCodeProgress = () => {
  usePageTitle('LeetCode progress');
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
          api.get('/leetcode-progress'),
          api.get('/leetcode-progress/stats')
        ]);
        
        setProblems(Array.isArray(problemsRes.data) ? problemsRes.data : []);
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
      default: return 'text-muted';
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
      default: return 'text-muted';
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <section id="leetcode-progress" className="pt-32 pb-20 bg-ink min-h-screen">
      <div className="shell">
        <h1 className="text-4xl mb-10">LeetCode progress</h1>
        
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div
              className="bg-panel rounded-xl p-6 text-center"
            >
              <div className="text-3xl font-bold text-blue-400 mb-2">{stats.total ?? 0}</div>
              <div className="text-muted">Total Problems</div>
            </div>
            
            <div
              className="bg-panel rounded-xl p-6 text-center"
            >
              <div className="text-3xl font-bold text-green-400 mb-2">{stats.solved ?? 0}</div>
              <div className="text-muted">Solved</div>
            </div>
            
            <div
              className="bg-panel rounded-xl p-6 text-center"
            >
              <div className="text-3xl font-bold text-yellow-400 mb-2">{stats.inProgress ?? 0}</div>
              <div className="text-muted">In Progress</div>
            </div>
            
            <div
              className="bg-panel rounded-xl p-6 text-center"
            >
              <div className="text-3xl font-bold text-red-400 mb-2">{stats.attempted ?? 0}</div>
              <div className="text-muted">Attempted</div>
            </div>
          </div>
        )}
        
        <div className="bg-panel rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search problems or tags..."
                aria-label="Search problems or tags"
                className="w-full bg-ink text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FaSearch className="absolute left-3 top-3 text-muted" />
            </div>
            
            <select
              name="difficulty"
              value={filters.difficulty}
              onChange={handleFilterChange}
              className="bg-ink text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="bg-ink text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <div className="bg-panel rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-line">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-muted">
                      Problem
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-muted">
                      Difficulty
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-muted">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-muted">
                      Date Solved
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-muted">
                      Solution
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {filteredProblems.map((problem) => (
                    <tr
                      key={problem._id}
                      className="hover:bg-line/40"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-white">{problem.title}</div>
                          <div className="text-sm text-muted">
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted">
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
                          <span className="text-muted">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredProblems.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted">No problems found matching your filters</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default LeetCodeProgress;