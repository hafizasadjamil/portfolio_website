import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FaEnvelope, FaPhone, FaLinkedin, FaGithub, FaTwitter } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const { name, email, subject, message } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await axios.post('/api/contact', formData);
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-white">Contact Me</h2>
        
        <div className="flex flex-col lg:flex-row gap-12">
          <motion.div
            className="lg:w-1/2"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-gray-900 rounded-xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold mb-6 text-white">Get In Touch</h3>
              
              {success && (
                <div className="mb-6 p-4 bg-green-900/30 text-green-400 rounded-lg">
                  Your message has been sent successfully!
                </div>
              )}
              
              {error && (
                <div className="mb-6 p-4 bg-red-900/30 text-red-400 rounded-lg">
                  {error}
                </div>
              )}
              
              <form onSubmit={onSubmit}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-gray-400 mb-2">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={name}
                    onChange={onChange}
                    required
                    className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-400 mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={onChange}
                    required
                    className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="subject" className="block text-gray-400 mb-2">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={subject}
                    onChange={onChange}
                    required
                    className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="message" className="block text-gray-400 mb-2">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={message}
                    onChange={onChange}
                    required
                    rows="5"
                    className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white rounded-lg py-3 font-medium hover:bg-blue-700 transition flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : 'Send Message'}
                </button>
              </form>
            </div>
          </motion.div>
          
          <motion.div
            className="lg:w-1/2"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-gray-900 rounded-xl p-8 shadow-lg h-full">
              <h3 className="text-2xl font-bold mb-6 text-white">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-blue-900/30 flex items-center justify-center mr-4">
                    <FaEnvelope className="text-blue-400 text-xl" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-white">Email</h4>
                    <p className="text-gray-400">contact@example.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-blue-900/30 flex items-center justify-center mr-4">
                    <FaPhone className="text-blue-400 text-xl" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-white">Phone</h4>
                    <p className="text-gray-400">+1 (123) 456-7890</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-medium text-white mb-4">Follow Me</h4>
                  <div className="flex space-x-4">
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-blue-900/30 flex items-center justify-center hover:bg-blue-700 transition">
                      <FaLinkedin className="text-blue-400 text-xl" />
                    </a>
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-blue-900/30 flex items-center justify-center hover:bg-blue-700 transition">
                      <FaGithub className="text-blue-400 text-xl" />
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-blue-900/30 flex items-center justify-center hover:bg-blue-700 transition">
                      <FaTwitter className="text-blue-400 text-xl" />
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="mt-12">
                <h4 className="text-lg font-medium text-white mb-4">Location</h4>
                <div className="bg-gray-800 rounded-lg h-64 flex items-center justify-center">
                  <p className="text-gray-500">Map will be displayed here</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;