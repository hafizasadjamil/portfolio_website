import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api, { getImageUrl } from '../services/api';
import { FaCalendarAlt, FaArrowLeft, FaEnvelope } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Booking = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/profile');
        setProfile(res.data);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 pt-32 pb-20 px-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[100px]"></div>
      </div>

      <div className="container mx-auto max-w-5xl relative z-10">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-12 transition-colors group">
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-black uppercase tracking-widest text-xs">Back to Home</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none mb-8">
                BOOK A <br />
                <span className="text-gray-500">CALL</span> <br />
                WITH ME
              </h1>

              <div className="flex items-center gap-6 mb-12">
                {profile?.profileImage && (
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/10 shadow-2xl">
                    <img src={getImageUrl(profile.profileImage)} alt="Profile" className="w-full h-full object-cover" />
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold text-white">Let's build something great</h3>
                  <p className="text-gray-400 text-sm">Schedule a 30-min discovery call</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 text-gray-400 bg-white/5 p-4 rounded-2xl border border-white/10">
                  <FaCalendarAlt className="text-blue-500" />
                  <span className="text-sm font-bold uppercase tracking-wider">30 Min Meeting</span>
                </div>
                <div className="flex items-center gap-4 text-gray-400 bg-white/5 p-4 rounded-2xl border border-white/10">
                  <FaEnvelope className="text-blue-500" />
                  <span className="text-sm font-bold uppercase tracking-wider">{profile?.socialLinks?.email}</span>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl h-[700px] relative"
            >
              {profile?.bookingUrl ? (
                <iframe
                  src={profile.bookingUrl}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  title="Schedule a Call"
                  className="rounded-3xl"
                ></iframe>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
                  <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mb-6">
                    <FaCalendarAlt className="text-blue-500 text-3xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Scheduling Temporarily Unavailable</h3>
                  <p className="text-gray-400 mb-8">Please reach out via email to schedule a call manually.</p>
                  <a href={`mailto:${profile?.socialLinks?.email}`} className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all">
                    Send an Email
                  </a>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
