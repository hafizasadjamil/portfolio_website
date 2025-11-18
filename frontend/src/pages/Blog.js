import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get('/api/blog');
        setBlogs(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-white">Loading blog posts...</div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-16 text-white text-center">Blog</h1>
        
        {blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog, index) => (
              <motion.div
                key={blog._id}
                className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -10 }}
              >
                <div className="h-48 overflow-hidden">
                  {blog.featuredImage ? (
                    <img
                      src={blog.featuredImage}
                      alt={blog.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">{blog.title.charAt(0)}</span>
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-white">{blog.title}</h3>
                  <p className="text-gray-400 mb-4">{blog.excerpt}</p>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {new Date(blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                    
                    <Link
                      to={`/blog/${blog.slug}`}
                      className="text-blue-400 hover:text-blue-300 transition"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">No blog posts found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;