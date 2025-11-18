import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaEnvelopeOpen, FaEnvelope, FaTrash, FaReply } from 'react-icons/fa';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);

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
      
      const res = await axios.get('/api/contact', config);
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
      
      await axios.put(`/api/contact/${id}`, {}, config);
      toast.success('Message marked as read');
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
        
        await axios.delete(`/api/contact/${id}`, config);
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
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-xl">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Messages</h1>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3 bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Inbox ({messages.length})</h2>
          </div>
          
          <div className="divide-y divide-gray-200 max-h-[calc(100vh-200px)] overflow-y-auto">
            {messages.length > 0 ? (
              messages.map((message) => (
                <div 
                  key={message._id}
                  className={`p-4 cursor-pointer hover:bg-gray-50 ${selectedMessage?._id === message._id ? 'bg-blue-50' : ''}`}
                  onClick={() => setSelectedMessage(message)}
                >
                  <div className="flex items-start">
                    <div className="mr-3">
                      {message.read ? (
                        <FaEnvelopeOpen className="text-gray-400" />
                      ) : (
                        <FaEnvelope className="text-blue-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {message.name}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {new Date(message.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">{message.subject}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <p className="text-gray-500">No messages found</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="md:w-2/3 bg-white rounded-lg shadow overflow-hidden">
          {selectedMessage ? (
            <div className="h-full flex flex-col">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-lg font-semibold">{selectedMessage.subject}</h2>
                <div className="flex space-x-2">
                  {!selectedMessage.read && (
                    <button
                      onClick={() => markAsRead(selectedMessage._id)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Mark as read"
                    >
                      <FaEnvelopeOpen />
                    </button>
                  )}
                  <button
                    onClick={() => handleReply(selectedMessage.email)}
                    className="text-green-600 hover:text-green-800"
                    title="Reply"
                  >
                    <FaReply />
                  </button>
                  <button
                    onClick={() => deleteMessage(selectedMessage._id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              
              <div className="p-6 flex-1 overflow-y-auto">
                <div className="mb-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{selectedMessage.name}</h3>
                      <p className="text-sm text-gray-500">{selectedMessage.email}</p>
                    </div>
                    <p className="text-sm text-gray-500">{formatDate(selectedMessage.createdAt)}</p>
                  </div>
                  
                  <div className="mt-6 text-gray-700 whitespace-pre-line">
                    {selectedMessage.message}
                  </div>
                </div>
              </div>
              
              <div className="p-4 border-t bg-gray-50">
                <button
                  onClick={() => handleReply(selectedMessage.email)}
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition flex items-center"
                >
                  <FaReply className="mr-2" /> Reply via Email
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full p-8">
              <div className="text-center">
                <FaEnvelope className="text-gray-300 text-5xl mx-auto mb-4" />
                <p className="text-gray-500">Select a message to view</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;