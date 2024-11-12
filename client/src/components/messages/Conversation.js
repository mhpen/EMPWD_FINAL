import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavSeeker from '../ui/navSeeker';

const Conversation = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/messages/conversation/${userId}`, {
        headers: getAuthHeaders()
      });
      
      if (response.data.success) {
        setMessages(response.data.data);
      } else {
        setError('Failed to load messages');
      }
      setLoading(false);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        setError('Failed to load messages');
        console.error('Error fetching messages:', err);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [userId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const response = await axios.post('http://localhost:5001/api/messages/send', {
        receiverId: userId,
        message: newMessage.trim()
      }, {
        headers: getAuthHeaders()
      });
      
      if (response.data.success) {
        setMessages(prev => [...prev, response.data.data]);
        setNewMessage('');
        fetchMessages();
      }
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        console.error('Error sending message:', err);
        setError('Failed to send message');
      }
    }
  };

  if (loading) {
    return <div className="p-4">Loading conversation...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavSeeker />
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-xl shadow h-[calc(100vh-200px)] flex flex-col">
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4">
            {messages.map((message) => (
              <div
                key={message._id}
                className={`mb-4 flex ${
                  message.senderId === userId ? 'justify-start' : 'justify-end'
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-xl p-3 ${
                    message.senderId === userId
                      ? 'bg-gray-100'
                      : 'bg-blue-500 text-white'
                  }`}
                >
                  <p>{message.message}</p>
                </div>
              </div>
            ))}
          </div>
          {/* Input and Send Button */}
          <div className="p-4 border-t border-gray-200">
            <form onSubmit={handleSend}>
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <button
                  type="submit"
                  className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Conversation; 