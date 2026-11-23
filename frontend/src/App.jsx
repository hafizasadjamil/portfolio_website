import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollManager from './components/ScrollManager';
import Home from './pages/Home';

// Loaded only when visited, to keep the home page light.
const Booking = lazy(() => import('./pages/Booking'));
const NotFound = lazy(() => import('./pages/NotFound'));
const LeetCodeProgress = lazy(() => import('./components/LeetCodeProgress'));

function App() {
  return (
    <Router>
      <ScrollManager />
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-grow">
          <Suspense fallback={<div className="min-h-screen" />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/courses-certifications" element={<Navigate to="/#courses-certifications" replace />} />
              <Route path="/leetcode-progress" element={<LeetCodeProgress />} />
              {/* The blog was removed; old links go to the home page. */}
              <Route path="/blog/*" element={<Navigate to="/" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
