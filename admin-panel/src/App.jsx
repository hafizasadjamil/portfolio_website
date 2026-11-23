import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { hasValidToken, onLogout } from './api';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ProjectsManager from './components/ProjectsManager';
import SkillsManager from './components/SkillsManager';
import AchievementsManager from './components/AchievementsManager';
import EducationManager from './components/EducationManager';
import ExperienceManager from './components/ExperienceManager';
import Messages from './components/Messages';
import ProfileManager from './components/ProfileManager';
import CoursesCertificationsManager from './components/CoursesCertificationsManager';
import LeetCodeProgressManager from './components/LeetCodeProgressManager';
import DemosManager from './components/DemosManager';
import JourneyManager from './components/JourneyManager';
import JobScraperManager from './components/JobScraperManager';

// Each of these has a list (/skills), a blank form (/skills/new) and an edit form (/skills/:id).
const managers = {
  projects: ProjectsManager,
  skills: SkillsManager,
  achievements: AchievementsManager,
  education: EducationManager,
  experience: ExperienceManager,
  'course-certifications': CoursesCertificationsManager,
  'leetcode-progress': LeetCodeProgressManager,
};

const managerRoutes = Object.entries(managers).flatMap(([path, Manager]) => [
  <Route key={path} path={`/${path}`} element={<Manager key={path} />} />,
  <Route key={`${path}-new`} path={`/${path}/new`} element={<Manager key={`${path}-new`} startNew />} />,
  <Route key={`${path}-edit`} path={`/${path}/:id`} element={<Manager key={`${path}-edit`} />} />,
]);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(hasValidToken);

  useEffect(() => onLogout(() => setIsAuthenticated(false)), []);

  const handleLogin = token => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

  return (
    <Router>
      <div className="flex h-screen bg-[#050505] overflow-hidden">
        <ToastContainer position="bottom-right" autoClose={3000} theme="dark" />

        {!isAuthenticated ? (
          <div className="flex-1 overflow-auto">
            <Login onLogin={handleLogin} />
          </div>
        ) : (
          <>
            <Sidebar />
            <div className="flex-1 overflow-auto relative">
              <div className="min-h-full">
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  {managerRoutes}
                  <Route path="/messages" element={<Messages />} />
                  <Route path="/profile" element={<ProfileManager />} />
                  <Route path="/demos" element={<DemosManager />} />
                  <Route path="/journey" element={<JourneyManager />} />
                  <Route path="/job-scraper" element={<JobScraperManager />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </div>
            </div>
          </>
        )}
      </div>
    </Router>
  );
}

export default App;
