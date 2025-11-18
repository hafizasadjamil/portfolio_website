import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../components/Sidebar';
import Login from '../components/Login';
import Dashboard from '../components/Dashboard';
import ProjectsManager from '../components/ProjectsManager';
import SkillsManager from '../components/SkillsManager';
import AchievementsManager from '../components/AchievementsManager';
import EducationManager from '../components/EducationManager';
import BlogManager from '../components/BlogManager';
import Messages from '../components/Messages';
import ProfileManager from '../components/ProfileManager';
import CoursesCertificationsManager from '../components/CoursesCertificationsManager';
import LeetCodeProgressManager from '../components/LeetCodeProgressManager';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const setAuth = boolean => {
    setIsAuthenticated(boolean);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        <ToastContainer position="top-right" autoClose={3000} />
        
        {!isAuthenticated ? (
          <Login setAuth={setAuth} />
        ) : (
          <>
            <Sidebar />
            <div className="flex-1 overflow-auto">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/projects" element={<ProjectsManager />} />
                <Route path="/projects/new" element={<ProjectsManager />} />
                <Route path="/projects/:id" element={<ProjectsManager />} />
                <Route path="/skills" element={<SkillsManager />} />
                <Route path="/skills/new" element={<SkillsManager />} />
                <Route path="/skills/:id" element={<SkillsManager />} />
                <Route path="/achievements" element={<AchievementsManager />} />
                <Route path="/achievements/new" element={<AchievementsManager />} />
                <Route path="/achievements/:id" element={<AchievementsManager />} />
                <Route path="/education" element={<EducationManager />} />
                <Route path="/education/new" element={<EducationManager />} />
                <Route path="/education/:id" element={<EducationManager />} />
                <Route path="/blog" element={<BlogManager />} />
                <Route path="/blog/new" element={<BlogManager />} />
                <Route path="/blog/:id" element={<BlogManager />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/profile" element={<ProfileManager />} />
                <Route path="*" element={<Navigate to="/dashboard" />} />
                <Route path="/course-certifications" element={<CoursesCertificationsManager />} />
                <Route path="/course-certifications/new" element={<CoursesCertificationsManager />} />
                <Route path="/course-certifications/:id" element={<CoursesCertificationsManager />} />
                <Route path="/leetcode-progress" element={<LeetCodeProgressManager />} />
                <Route path="/leetcode-progress/new" element={<LeetCodeProgressManager />} />
                <Route path="/leetcode-progress/:id" element={<LeetCodeProgressManager />} />
              </Routes>
            </div>
          </>
        )}
      </div>
    </Router>
  );
}

export default App;