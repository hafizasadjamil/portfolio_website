import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import CoursesCertifications from './components/CoursesCertifications';
import LeetCodeProgress from './components/LeetCodeProgress';
// import MinimalTest from './components/MinimalTest';

// function App() {
//   return (
//     <div className="flex flex-col min-h-screen bg-gray-900 text-white">
//       <MinimalTest />
//     </div>
//   );
// }

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-900 text-white">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/courses-certifications" element={<CoursesCertifications />} />
            <Route path="/leetcode-progress" element={<LeetCodeProgress />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;