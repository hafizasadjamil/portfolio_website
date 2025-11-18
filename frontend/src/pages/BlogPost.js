import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft } from 'react-icons/fa';

const BlogPost = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`/api/blog/${slug}`);
        setBlog(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-white">Loading blog post...</div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="pt-24 pb-20 bg-gray-900 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">Blog Post Not Found</h1>
            <p className="text-gray-400 mb-8">The blog post you're looking for doesn't exist.</p>
            <Link
              to="/blog"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <FaArrowLeft className="mr-2" /> Back to Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link
          to="/blog"
          className="inline-flex items-center text-blue-400 hover:text-blue-300 transition mb-8"
        >
          <FaArrowLeft className="mr-2" /> Back to Blog
        </Link>
        
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">{blog.title}</h1>
          
          <div className="flex items-center text-gray-400 mb-8">
            <span>{new Date(blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            {blog.tags.length > 0 && (
              <>
                <span className="mx-2">•</span>
                <div className="flex flex-wrap">
                  {blog.tags.map((tag, index) => (
                    <span key={index} className="bg-blue-900/30 text-blue-400 text-xs px-2 py-1 rounded mr-2">
                      {tag}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
          
          {blog.featuredImage && (
            <div className="mb-8 rounded-xl overflow-hidden">
              <img
                src={blog.featuredImage}
                alt={blog.title}
                className="w-full h-auto object-cover"
              />
            </div>
          )}
          
          <div className="prose prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: blog.content }} />
          </div>
        </motion.article>
      </div>
    </div>
  );
};

export default BlogPost;