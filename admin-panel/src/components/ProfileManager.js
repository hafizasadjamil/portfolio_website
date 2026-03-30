import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaSave, FaUser, FaLinkedin, FaGithub, FaTwitter, FaEnvelope, FaPhone, FaCloudUploadAlt, FaGlobe, FaBriefcase } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ProfileManager = () => {
  const [profile, setProfile] = useState({
    name: '',
    tagline: '',
    bio: '',
    cvUrl: '',
    socialLinks: {
      linkedin: '',
      github: '',
      twitter: '',
      email: '',
      phone: ''
    },
    bookingUrl: ''
  });
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchProfile();
  }, []);

  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http') || url.startsWith('blob:')) return url;
    const cleanUrl = url.startsWith('/') ? url.substring(1) : url;
    return `${API_URL}/${cleanUrl}`;
  };

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token
        }
      };

      const res = await axios.get(`${API_URL}/api/profile`, config);
      setProfile(res.data);
      setImagePreview(res.data.profileImage);
      setLoading(false);
    } catch (err) {
      toast.error('Failed to fetch profile');
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('socialLinks.')) {
      const field = name.split('.')[1];
      setProfile({
        ...profile,
        socialLinks: {
          ...profile.socialLinks,
          [field]: value
        }
      });
    } else {
      setProfile({
        ...profile,
        [name]: value
      });
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('name', profile.name);
    data.append('tagline', profile.tagline);
    data.append('bio', profile.bio);
    data.append('cvUrl', profile.cvUrl);
    data.append('socialLinks', JSON.stringify(profile.socialLinks));
    data.append('bookingUrl', profile.bookingUrl);

    if (profileImage) {
      data.append('profileImage', profileImage);
    }

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token,
          'Content-Type': 'multipart/form-data'
        }
      };

      await axios.put(`${API_URL}/api/profile`, data, config);
      toast.success('Profile updated successfully');
      fetchProfile();
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-[#050505]">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-10 bg-[#050505] min-h-screen">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto"
      >
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter">Profile <span className="text-blue-500">Identity</span></h1>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-2">Personal branding and contact details</p>
          </div>
          <button 
            onClick={onSubmit}
            className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center gap-3"
          >
            <FaSave /> Update Profile
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Column: Image and Main Info */}
          <div className="space-y-10">
            <div className="bg-[#0d0d0f] border border-white/5 p-8 rounded-[2.5rem] flex flex-col items-center">
              <div className="relative group mb-8">
                <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white/5 group-hover:border-blue-500/30 transition-all duration-500">
                  {imagePreview ? (
                    <img src={getImageUrl(imagePreview)} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-white/5 flex items-center justify-center">
                      <FaUser className="text-5xl text-gray-700" />
                    </div>
                  )}
                </div>
                <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-all duration-500">
                  <FaCloudUploadAlt className="text-white text-3xl" />
                  <input type="file" onChange={handleImageChange} className="hidden" />
                </label>
              </div>
              <h3 className="text-xl font-black text-white text-center mb-1">{profile.name || 'Your Name'}</h3>
              <p className="text-blue-500 text-[10px] font-black uppercase tracking-[0.2em] text-center">{profile.tagline || 'Your Professional Tagline'}</p>
            </div>

            <div className="bg-[#0d0d0f] border border-white/5 p-8 rounded-[2.5rem] space-y-6">
              <h3 className="text-white font-black uppercase tracking-widest text-xs flex items-center gap-3">
                <FaGlobe className="text-blue-500" /> Web Links
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-500 text-[8px] font-black uppercase tracking-widest mb-2">CV / Resume URL</label>
                  <input
                    type="text"
                    name="cvUrl"
                    value={profile.cvUrl}
                    onChange={onChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 text-[8px] font-black uppercase tracking-widest mb-2">Booking Link (Calendly)</label>
                  <input
                    type="text"
                    name="bookingUrl"
                    value={profile.bookingUrl}
                    onChange={onChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-blue-500 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Detailed Forms */}
          <div className="lg:col-span-2 space-y-10">
            <div className="bg-[#0d0d0f] border border-white/5 p-10 rounded-[2.5rem] space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-3">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={onChange}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-bold"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-3">Tagline</label>
                  <input
                    type="text"
                    name="tagline"
                    value={profile.tagline}
                    onChange={onChange}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-3">Professional Biography</label>
                <textarea
                  name="bio"
                  value={profile.bio}
                  onChange={onChange}
                  rows="6"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-medium leading-relaxed"
                ></textarea>
              </div>
            </div>

            <div className="bg-[#0d0d0f] border border-white/5 p-10 rounded-[2.5rem] space-y-8">
              <h3 className="text-white font-black uppercase tracking-widest text-xs flex items-center gap-3">
                <FaBriefcase className="text-blue-500" /> Social & Contact
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="flex items-center gap-2 text-gray-400 text-[9px] font-black uppercase tracking-widest mb-3">
                      <FaLinkedin className="text-blue-400" /> LinkedIn
                    </label>
                    <input
                      type="text"
                      name="socialLinks.linkedin"
                      value={profile.socialLinks.linkedin}
                      onChange={onChange}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-gray-400 text-[9px] font-black uppercase tracking-widest mb-3">
                      <FaGithub className="text-white" /> GitHub
                    </label>
                    <input
                      type="text"
                      name="socialLinks.github"
                      value={profile.socialLinks.github}
                      onChange={onChange}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-gray-400 text-[9px] font-black uppercase tracking-widest mb-3">
                      <FaTwitter className="text-blue-300" /> Twitter / X
                    </label>
                    <input
                      type="text"
                      name="socialLinks.twitter"
                      value={profile.socialLinks.twitter}
                      onChange={onChange}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="flex items-center gap-2 text-gray-400 text-[9px] font-black uppercase tracking-widest mb-3">
                      <FaEnvelope className="text-red-400" /> Email Address
                    </label>
                    <input
                      type="email"
                      name="socialLinks.email"
                      value={profile.socialLinks.email}
                      onChange={onChange}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-gray-400 text-[9px] font-black uppercase tracking-widest mb-3">
                      <FaPhone className="text-green-400" /> Phone Number
                    </label>
                    <input
                      type="text"
                      name="socialLinks.phone"
                      value={profile.socialLinks.phone}
                      onChange={onChange}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfileManager;
