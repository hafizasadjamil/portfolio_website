import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaEnvelopeOpen, FaEnvelope, FaTrash, FaReply, FaUser, FaClock, FaCheckCircle, FaInbox } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token
        }
      };
      
      const res = await axios.get(`${API_URL}/api/contact`, config);
      setMessages(res.data);
      setLoading(false);
    } catch (err) {
      toast.error('Failed to fetch messages');
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token
        }
      };
      
      await axios.put(`${API_URL}/api/contact/${id}`, {}, config);
      fetchMessages();
    } catch (err) {
      toast.error('Failed to mark message as read');
    }
  };

  const deleteMessage = async (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            'x-auth-token': token
          }
        };
        
        await axios.delete(`${API_URL}/api/contact/${id}`, config);
        toast.success('Message deleted successfully');
        fetchMessages();
        if (selectedMessage && selectedMessage._id === id) {
          setSelectedMessage(null);
        }
      } catch (err) {
        toast.error('Failed to delete message');
      }
    }
  };

  const handleReply = (email) => {
    window.open(`mailto:${email}`, '_blank');
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
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
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter flex items-center gap-4">
            Message <span className="text-blue-500">Inbox</span>
            <span className="bg-blue-600/10 text-blue-500 text-xs px-3 py-1 rounded-full border border-blue-500/20">{messages.length}</span>
          </h1>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-2">Manage inquiries and communications</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Message List */}
        <div className="lg:col-span-4 space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto no-scrollbar">
          {messages.map((msg) => (
            <div 
              key={msg._id}
              onClick={() => {
                setSelectedMessage(msg);
                if (!msg.read) markAsRead(msg._id);
              }}
              className={`p-6 rounded-[2rem] border transition-all cursor-pointer group relative overflow-hidden ${
                selectedMessage?._id === msg._id 
                  ? 'bg-blue-600 border-blue-500 shadow-lg shadow-blue-600/20' 
                  : msg.read 
                    ? 'bg-[#0d0d0f] border-white/5 hover:border-white/10' 
                    : 'bg-[#0d0d0f] border-blue-500/30 shadow-lg shadow-blue-500/5'
              }`}
            >
              {!msg.read && (
                <div className="absolute top-6 right-6 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              )}
              <div className="flex items-center gap-4 mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedMessage?._id === msg._id ? 'bg-white/20' : 'bg-white/5'}`}>
                  <FaUser className={selectedMessage?._id === msg._id ? 'text-white' : 'text-gray-500'} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`text-sm font-black truncate ${selectedMessage?._id === msg._id ? 'text-white' : 'text-gray-200'}`}>
                    {msg.name}
                  </h4>
                  <p className={`text-[10px] font-bold uppercase tracking-widest ${selectedMessage?._id === msg._id ? 'text-blue-100' : 'text-gray-500'}`}>
                    {formatDate(msg.date).split(',')[0]}
                  </p>
                </div>
              </div>
              <p className={`text-xs font-medium line-clamp-1 ${selectedMessage?._id === msg._id ? 'text-blue-50' : 'text-gray-400'}`}>
                {msg.subject}
              </p>
            </div>
          ))}
          {messages.length === 0 && (
            <div className="text-center py-20 bg-[#0d0d0f] border border-white/5 rounded-[2.5rem]">
              <FaInbox className="text-4xl text-gray-800 mx-auto mb-4" />
              <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Your inbox is empty</p>
            </div>
          )}
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {selectedMessage ? (
              <motion.div
                key={selectedMessage._id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-[#0d0d0f] border border-white/5 rounded-[3rem] p-12 h-full flex flex-col"
              >
                <div className="flex justify-between items-start mb-12">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-blue-600/10 rounded-[1.5rem] flex items-center justify-center text-blue-500 text-3xl">
                      {selectedMessage.name.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-3xl font-black text-white tracking-tighter">{selectedMessage.name}</h2>
                      <p className="text-blue-500 font-bold text-sm">{selectedMessage.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleReply(selectedMessage.email)}
                      className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-blue-600 hover:border-blue-500 transition-all"
                      title="Reply"
                    >
                      <FaReply size={14} />
                    </button>
                    <button 
                      onClick={() => deleteMessage(selectedMessage._id)}
                      className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-red-500 hover:bg-red-600 hover:text-white hover:border-red-500 transition-all"
                      title="Delete"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-8 mb-12 py-6 border-y border-white/5">
                  <div className="flex items-center gap-2">
                    <FaClock className="text-gray-600" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{formatDate(selectedMessage.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCheckCircle className="text-green-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Received via Website</span>
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-black text-white mb-6 uppercase tracking-tight">{selectedMessage.subject}</h3>
                  <div className="bg-white/5 rounded-[2rem] p-8 text-gray-300 leading-relaxed font-medium whitespace-pre-wrap">
                    {selectedMessage.message}
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-white/5">
                  <button 
                    onClick={() => handleReply(selectedMessage.email)}
                    className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
                  >
                    Send Response
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="bg-[#0d0d0f] border border-white/5 border-dashed rounded-[3rem] p-12 h-full flex flex-col items-center justify-center text-center opacity-50">
                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
                  <FaEnvelope className="text-gray-700 text-4xl" />
                </div>
                <h3 className="text-2xl font-black text-white tracking-tighter mb-2">Select a message</h3>
                <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Pick an inquiry from the inbox to view details</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Messages;
