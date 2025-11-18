import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaSave, FaUser, FaLinkedin, FaGithub, FaTwitter, FaEnvelope, FaPhone } from 'react-icons/fa';

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
    }
  });
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token
        }
      };
      
      const res = await axios.get('/api/profile', config);
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
      
      await axios.put('/api/profile', data, config);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-xl">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="profileImage">
                Profile Image
              </label>
              <div className="flex flex-col items-center">
                {imagePreview ? (
                  <img 
                    src={imagePreview} 
                    alt="Profile" 
                    className="w-48 h-48 object-cover rounded-full mb-4"
                  />
                ) : (
                  <div className="w-48 h-48 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                    <FaUser className="text-gray-400 text-5xl" />
                  </div>
                )}
                <input
                  type="file"
                  id="profileImage"
                  onChange={handleImageChange}
                  accept="image/*"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            </div>
          </div>
          
          <div className="md:w-2/3">
            <form onSubmit={onSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={profile.name}
                  onChange={onChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tagline">
                  Tagline
                </label>
                <input
                  type="text"
                  id="tagline"
                  name="tagline"
                  value={profile.tagline}
                  onChange={onChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bio">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={profile.bio}
                  onChange={onChange}
                  required
                  rows="5"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                ></textarea>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cvUrl">
                  CV URL
                </label>
                <input
                  type="text"
                  id="cvUrl"
                  name="cvUrl"
                  value={profile.cvUrl}
                  onChange={onChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              
              <h3 className="text-lg font-semibold mb-4">Social Links</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="linkedin">
                    <FaLinkedin className="inline mr-2" /> LinkedIn
                  </label>
                  <input
                    type="text"
                    id="linkedin"
                    name="socialLinks.linkedin"
                    value={profile.socialLinks.linkedin}
                    onChange={onChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="github">
                    <FaGithub className="inline mr-2" /> GitHub
                  </label>
                  <input
                    type="text"
                    id="github"
                    name="socialLinks.github"
                    value={profile.socialLinks.github}
                    onChange={onChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="twitter">
                    <FaTwitter className="inline mr-2" /> Twitter
                  </label>
                  <input
                    type="text"
                    id="twitter"
                    name="socialLinks.twitter"
                    value={profile.socialLinks.twitter}
                    onChange={onChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                    <FaEnvelope className="inline mr-2" /> Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="socialLinks.email"
                    value={profile.socialLinks.email}
                    onChange={onChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                    <FaPhone className="inline mr-2" /> Phone
                  </label>
                  <input
                    type="text"
                    id="phone"
                    name="socialLinks.phone"
                    value={profile.socialLinks.phone}
                    onChange={onChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition flex items-center"
                >
                  <FaSave className="mr-2" /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileManager;