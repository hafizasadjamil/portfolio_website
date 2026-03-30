import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaSearch, FaBriefcase, FaMapMarkerAlt, FaExternalLinkAlt, FaClock, FaBuilding } from 'react-icons/fa';
import { motion } from 'framer-motion';

const JobScraperManager = () => {
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState(null);
  const [formData, setFormData] = useState({
    query: 'AI Engineer',
    customQuery: '',
    location: 'Remote (worldwide)',
    limit: 100,
    datePosted: '72h'
  });

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const jobTitles = [
    'Custom Search...',
    'AI Engineer',
    'Machine Learning Engineer',
    'AI Developer',
    'Python Developer (AI/ML focus)',
    'Backend Developer (FastAPI / APIs)',
    'NLP / LLM Engineer'
  ];

  const locations = [
    'Remote (worldwide)',
    'Pakistan (Lahore)',
    'UAE (Dubai)',
    'Remote',
    'Worldwide',
    'USA',
    'UK'
  ];

  const handleScrape = async (e) => {
    e.preventDefault();
    setLoading(true);
    setJobs([]);

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token,
          'Content-Type': 'application/json'
        }
      };

      // Clean query and location for API
      let searchQuery = formData.query === 'Custom Search...' ? formData.customQuery : formData.query;
      if (!searchQuery) {
        toast.error('Please enter a job title or custom search query.');
        setLoading(false);
        return;
      }

      let searchLocation = formData.location;
      if (searchLocation === 'Pakistan (Lahore)') searchLocation = 'Pakistan';
      if (searchLocation === 'UAE (Dubai)') searchLocation = 'UAE';
      if (searchLocation === 'Remote (worldwide)') searchLocation = 'Remote';

      const res = await axios.post(`${API_URL}/api/job-scraper/scrape`, {
        ...formData,
        query: searchQuery,
        location: searchLocation
      }, config);

      setJobs(res.data);
      if (res.data.length === 0) {
        toast.info('No jobs found. Try a more generic job title or "Remote" location.');
      } else {
        toast.success(`Found ${res.data.length} jobs!`);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Failed to run scraper. Make sure backend is running and Python requirements are met.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToDatabase = (job) => {
    // This could be implemented to save the job to a 'SavedJobs' collection
    toast.info(`Saving "${job.title}" to database is not implemented yet, but you can view it at the link.`);
  };

  return (
    <div className="p-6 bg-[#050505] min-h-screen text-white">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
            Job Scraper
          </h1>
          <p className="text-gray-400 mt-2">Search and scrape jobs from various platforms</p>
        </header>

        {/* Search Criteria Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#111] p-6 rounded-xl border border-gray-800 mb-8"
        >
          <form onSubmit={handleScrape} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Job Title</label>
                <select
                  className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 text-white"
                  value={formData.query}
                  onChange={(e) => setFormData({ ...formData, query: e.target.value })}
                >
                  {jobTitles.map(title => (
                    <option key={title} value={title}>{title}</option>
                  ))}
                </select>
              </div>

              {formData.query === 'Custom Search...' && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Custom Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Node.js Developer"
                    className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 text-white"
                    value={formData.customQuery}
                    onChange={(e) => setFormData({ ...formData, customQuery: e.target.value })}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Location</label>
                <select
                  className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 text-white"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                >
                  {locations.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Date Posted</label>
                <select
                  className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 text-white"
                  value={formData.datePosted}
                  onChange={(e) => setFormData({ ...formData, datePosted: e.target.value })}
                >
                  <option value="24h">Last 24 hours</option>
                  <option value="48h">Last 48 hours</option>
                  <option value="72h">Last 72 hours</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className={`min-w-[150px] bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300 flex items-center justify-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    Scraping...
                  </>
                ) : (
                  <>
                    <FaSearch /> Scrape Jobs
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Results Section */}
        <div className="space-y-4">
          {jobs && jobs.length > 0 && (
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Search Results ({jobs.length})</h2>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobs?.map((job, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="bg-[#111] p-5 rounded-xl border border-gray-800 hover:border-blue-500/50 transition-all group"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-blue-400 group-hover:text-blue-300">{job.title}</h3>
                  <span className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-400">{job.source}</span>
                </div>

                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <FaBuilding className="text-gray-500" />
                    <span>{job.company}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-gray-500" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaClock className="text-gray-500" />
                    <span>{job.date}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-800 flex justify-between items-center">
                  <a
                    href={job.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-400 flex items-center gap-1 text-sm font-medium"
                  >
                    View Job <FaExternalLinkAlt size={12} />
                  </a>
                  <button
                    onClick={() => handleSaveToDatabase(job)}
                    className="text-xs bg-blue-600/10 text-blue-400 px-3 py-1 rounded-full hover:bg-blue-600/20 transition-colors"
                  >
                    Save to Database
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {!loading && jobs === null && (
            <div className="text-center py-20 bg-[#111] rounded-xl border border-gray-800 border-dashed">
              <FaSearch className="mx-auto text-4xl text-gray-700 mb-4 opacity-20" />
              <p className="text-gray-500">Select criteria and click "Scrape Jobs" to begin searching.</p>
            </div>
          )}

          {!loading && jobs !== null && jobs.length === 0 && (
            <div className="text-center py-20 bg-[#111] rounded-xl border border-gray-800 border-dashed">
              <FaBriefcase className="mx-auto text-4xl text-gray-700 mb-4" />
              <p className="text-gray-400">No jobs found matching your criteria.</p>
              <p className="text-gray-500 text-sm mt-2 max-w-md mx-auto">
                Try a more generic job title (e.g., "Python" instead of "Python Developer (AI/ML focus)") or select "Remote (worldwide)" as the location.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobScraperManager;
