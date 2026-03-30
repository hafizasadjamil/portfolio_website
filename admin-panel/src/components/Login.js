import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FaLock, FaEnvelope, FaShieldAlt } from 'react-icons/fa';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const { email, password } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password
      });
      
      localStorage.setItem('token', res.data.token);
      toast.success('Access Granted. Welcome back.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] relative overflow-hidden px-4">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full relative z-10"
      >
        <div className="bg-[#0d0d0f] border border-white/5 p-10 md:p-12 rounded-[3rem] shadow-2xl backdrop-blur-3xl">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-blue-600/10 rounded-[2rem] border border-blue-500/20 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-600/5">
              <FaShieldAlt className="text-blue-500 text-3xl" />
            </div>
            <h2 className="text-4xl font-black text-white tracking-tighter mb-2">
              Control <span className="text-blue-500">Center</span>
            </h2>
            <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-[10px]">Administrative Authentication</p>
          </div>

          <form className="space-y-6" onSubmit={onSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-500 text-[10px] font-black uppercase tracking-widest mb-3 ml-1">Email Identity</label>
                <div className="relative group">
                  <FaEnvelope className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={onChange}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-bold text-sm"
                    placeholder="admin@portfolio.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-500 text-[10px] font-black uppercase tracking-widest mb-3 ml-1">Access Key</label>
                <div className="relative group">
                  <FaLock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={onChange}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-bold text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-xs py-5 rounded-2xl transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>Authorize Access <span className="text-lg leading-none">→</span></>
                )}
              </button>
            </div>
          </form>

          <div className="mt-10 pt-8 border-t border-white/5 text-center">
            <p className="text-gray-600 text-[9px] font-black uppercase tracking-[0.3em]">Secure Environment • v2.0</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;