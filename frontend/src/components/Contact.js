import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { FaEnvelope, FaPhone, FaLinkedin, FaGithub, FaTwitter } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/profile');
        setProfile(res.data);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      }
    };
    fetchProfile();
  }, []);

  const { name, email, subject, message } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/contact', formData);
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
    <section id="contact" className="py-24 bg-gray-950 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-10">
        <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[120px]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Get In <span className="text-gradient">Touch</span>
        </motion.h2>

        <div className="flex flex-col lg:flex-row gap-16 max-w-7xl mx-auto">
          {/* Left Column: Form */}
          <motion.div
            className="lg:w-1/2"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="glass-card rounded-[2.5rem] p-10 md:p-12 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-2 h-full bg-blue-600"></div>

              <h3 className="text-3xl font-black mb-8 text-white tracking-tight">Let's build something <span className="text-blue-400">extraordinary.</span></h3>

              {success && (
                <div className="mb-8 p-6 bg-green-500/10 text-green-400 rounded-2xl border border-green-500/20 animate-pulse font-bold text-center">
                  Message sent successfully! I'll get back to you soon.
                </div>
              )}

              {error && (
                <div className="mb-8 p-6 bg-red-500/10 text-red-400 rounded-2xl border border-red-500/20 font-bold text-center">
                  {error}
                </div>
              )}

              <form onSubmit={onSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Your Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={name}
                      onChange={onChange}
                      placeholder="John Doe"
                      required
                      className="w-full bg-white/5 text-white rounded-2xl px-6 py-4 border border-white/10 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300 placeholder:text-gray-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Your Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={onChange}
                      placeholder="john@example.com"
                      required
                      className="w-full bg-white/5 text-white rounded-2xl px-6 py-4 border border-white/10 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300 placeholder:text-gray-600"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={subject}
                    onChange={onChange}
                    placeholder="Project Inquiry"
                    required
                    className="w-full bg-white/5 text-white rounded-2xl px-6 py-4 border border-white/10 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300 placeholder:text-gray-600"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Your Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={message}
                    onChange={onChange}
                    placeholder="Tell me about your vision..."
                    required
                    rows="5"
                    className="w-full bg-white/5 text-white rounded-2xl px-6 py-4 border border-white/10 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300 placeholder:text-gray-600 resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full bg-blue-600 text-white rounded-2xl py-5 font-black text-lg shadow-2xl shadow-blue-600/20 hover:bg-blue-700 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-4 ${loading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  {loading ? (
                    <>
                      <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      Send Message
                      <span className="w-8 h-[1px] bg-white/50 group-hover:w-12 transition-all"></span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>

          {/* Right Column: Info & Map */}
          <motion.div
            className="lg:w-1/2 flex flex-col gap-8"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="glass-card rounded-[2.5rem] p-10 flex-grow">
              <div className="space-y-10">
                <div className="flex items-center group cursor-pointer">
                  <div className="w-16 h-16 rounded-2xl bg-blue-600/10 flex items-center justify-center mr-6 group-hover:bg-blue-600 group-hover:scale-110 transition-all duration-500">
                    <FaEnvelope className="text-blue-400 text-2xl group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-1">Email Me</h4>
                    <a
                      href={`mailto:${profile?.socialLinks?.email || 'contact@example.com'}`}
                      className="text-xl text-white font-bold hover:text-blue-400 transition-colors"
                    >
                      {profile?.socialLinks?.email || 'contact@example.com'}
                    </a>
                  </div>
                </div>

                <div className="flex items-center group cursor-pointer">
                  <div className="w-16 h-16 rounded-2xl bg-purple-600/10 flex items-center justify-center mr-6 group-hover:bg-purple-600 group-hover:scale-110 transition-all duration-500">
                    <FaPhone className="text-purple-400 text-2xl group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-1">Call Me</h4>
                    <a
                      href={`tel:${profile?.socialLinks?.phone || '+11234567890'}`}
                      className="text-xl text-white font-bold hover:text-purple-400 transition-colors"
                    >
                      {profile?.socialLinks?.phone || '+1 (123) 456-7890'}
                    </a>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5">
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-6">Connect Globally</h4>
                  <div className="flex gap-4 relative z-10">
                    <a
                      href={profile?.socialLinks?.linkedin?.startsWith('http') ? profile.socialLinks.linkedin : (profile?.socialLinks?.linkedin ? `https://${profile.socialLinks.linkedin}` : 'https://linkedin.com')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 hover:scale-110 transition-all duration-500 group/link"
                    >
                      <FaLinkedin className="text-blue-400 text-2xl group-hover/link:text-white" />
                    </a>
                    <a
                      href={profile?.socialLinks?.github?.startsWith('http') ? profile.socialLinks.github : (profile?.socialLinks?.github ? `https://${profile.socialLinks.github}` : 'https://github.com')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-gray-700 hover:border-gray-700 hover:scale-110 transition-all duration-500 group/link"
                    >
                      <FaGithub className="text-white text-2xl" />
                    </a>
                    <a
                      href={profile?.socialLinks?.twitter?.startsWith('http') ? profile.socialLinks.twitter : (profile?.socialLinks?.twitter ? `https://${profile.socialLinks.twitter}` : 'https://twitter.com')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-sky-500 hover:border-sky-500 hover:scale-110 transition-all duration-500 group/link"
                    >
                      <FaTwitter className="text-sky-400 text-2xl group-hover/link:text-white" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-[2.5rem] h-72 overflow-hidden group relative">
              <div className="absolute top-4 left-4 z-20 glass-card px-4 py-2 rounded-xl border border-white/10 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-white">Live from Lahore, PK</span>
              </div>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d217633.9110243403!2d74.17325126848152!3d31.482635227768565!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39190483e58107d9%3A0xc202c607751d8d!2sLahore%2C%20Punjab%2C%20Pakistan!5e0!3m2!1sen!2s!4v1711551234567!5m2!1sen!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Lahore Pakistan Map"
                className="grayscale contrast-125 opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
              ></iframe>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;