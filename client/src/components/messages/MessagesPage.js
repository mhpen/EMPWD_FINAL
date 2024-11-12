import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import NavSeeker from '../ui/navSeeker';
import NavEmployer from '../ui/navEmployer';
import { Search, MessageCircle } from 'lucide-react';

const MessagesPage = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const messagesEndRef = useRef(null);
  const location = useLocation();

  const navigate = useNavigate();

  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    console.log('Current user role:', role);
    setUserRole(role?.toLowerCase());
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get('/api/users/current');
        if (response.data.success) {
          setCurrentUser(response.data.user);
        }
      } catch (err) {
        console.error('Error fetching current user:', err);
        navigate('/login');
      }
    };
    fetchCurrentUser();
  }, [navigate]);

  // Fetch conversations
  const fetchConversations = async () => {
    if (!currentUser) return;

    try {
      const response = await axios.get('/api/messages/conversations');
      if (response.data.success) {
        setConversations(response.data.data);
        setLoading(false);
      }
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setError('Failed to load conversations');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchConversations();
    }
  }, [currentUser]);

  // Fetch messages for selected conversation
  const fetchMessages = async (partnerId) => {
    try {
      console.log('Fetching messages for partner:', partnerId);
      const response = await axios.get(`/api/messages/conversation/${partnerId}`);
      console.log('Messages response:', response.data);
      if (response.data.success) {
        setMessages(response.data.data);
        setTimeout(scrollToBottom, 100);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Failed to load messages');
    }
  };

  useEffect(() => {
    if (selectedConversation?.partner?._id) {
      fetchMessages(selectedConversation.partner._id);
      const interval = setInterval(() => {
        fetchMessages(selectedConversation.partner._id);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [selectedConversation]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation?.partner?._id) return;

    try {
      const response = await axios.post('/api/messages/send', {
        receiverId: selectedConversation.partner._id,
        message: newMessage.trim()
      });
      
      if (response.data.success) {
        // Add new message to the messages array
        const newMsg = response.data.data;
        setMessages(prev => [...prev, newMsg]);
        setNewMessage('');
        
        // Update conversations list
        await fetchConversations();
        
        // Scroll to bottom
        setTimeout(scrollToBottom, 100);
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
    }
  };

  // Filter conversations
  const filteredConversations = conversations.filter(conv => 
    conv.partner?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Debug logging
  useEffect(() => {
    console.log('Current messages:', messages);
  }, [messages]);

  // Add this effect to handle initial conversation selection
  useEffect(() => {
    const initializeConversation = async () => {
      if (location.state?.selectedUserId && conversations.length > 0) {
        const conversation = conversations.find(
          conv => conv.partner._id === location.state.selectedUserId
        );
        
        if (conversation) {
          setSelectedConversation(conversation);
        } else {
          // If conversation doesn't exist yet, create a temporary one
          const response = await axios.get(`/api/users/${location.state.selectedUserId}`);
          if (response.data.success) {
            setSelectedConversation({
              partner: response.data.user,
              lastMessage: null,
              unreadCount: 0
            });
          }
        }
      }
    };

    initializeConversation();
  }, [location.state, conversations]);

  return (
    <div className="min-h-screen bg-gray-50">
      {console.log('Rendering with role:', userRole)}
      
      {userRole === 'jobseeker' && (
        <div className="fixed top-0 w-full z-50">
          <NavSeeker />
        </div>
      )}

      <div className={`flex min-h-screen ${userRole === 'jobseeker' ? 'pt-16' : ''}`}>
        {userRole === 'employer' && (
          <div className="fixed left-0 h-full">
            <NavEmployer />
          </div>
        )}

        <div className={`flex-1 ${userRole === 'employer' ? 'ml-64' : ''}`}>
          <div className="flex-1 flex flex-col overflow-hidden">
            {location.state?.jobTitle && location.state?.companyName && (
              <div className="px-4 py-2 bg-blue-50">
                <p className="text-sm text-blue-800">
                  Conversation regarding: {location.state.jobTitle} at {location.state.companyName}
                </p>
              </div>
            )}

            <div className="flex-1 p-4">
              <div className="bg-white rounded-xl shadow-sm h-[calc(100vh-100px)] flex">
                <div className="w-80 border-r border-gray-200 flex flex-col">
                  <div className="p-4 border-b border-gray-200">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        placeholder="Search conversations..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto">
                    {loading ? (
                      <div className="p-4 text-center text-gray-500">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="mt-2">Loading conversations...</p>
                      </div>
                    ) : error ? (
                      <div className="p-4 text-center text-red-500">{error}</div>
                    ) : filteredConversations.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        {searchTerm ? 'No conversations found' : 'No conversations yet'}
                      </div>
                    ) : (
                      filteredConversations.map((conv) => (
                        <div
                          key={conv.partner?._id}
                          onClick={() => setSelectedConversation(conv)}
                          className={`p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${
                            selectedConversation?.partner?._id === conv.partner?._id ? 'bg-blue-50' : ''
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                              {conv.partner?.email?.charAt(0).toUpperCase() || '?'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-gray-900 truncate">
                                {conv.partner?.email || 'Unknown User'}
                              </h3>
                              <p className="text-sm text-gray-500 truncate">
                                {conv.lastMessage?.message || 'No messages yet'}
                              </p>
                            </div>
                            {conv.unreadCount > 0 && (
                              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                                {conv.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="flex-1 flex flex-col">
                  {selectedConversation ? (
                    <>
                      <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            {selectedConversation.partner?.email?.charAt(0).toUpperCase() || '?'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h2 className="font-medium text-lg truncate">
                              {selectedConversation.partner?.email || 'Unknown User'}
                            </h2>
                            {selectedConversation.partner?.role && (
                              <p className="text-sm text-gray-500 capitalize">
                                {selectedConversation.partner.role}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 overflow-y-auto p-4">
                        <div className="space-y-4">
                          {messages.map((message) => (
                            <div
                              key={message._id}
                              className={`flex ${
                                message.senderId === currentUser?._id ? 'justify-end' : 'justify-start'
                              }`}
                            >
                              <div
                                className={`max-w-[70%] rounded-xl p-3 ${
                                  message.senderId === currentUser?._id
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-100'
                                }`}
                              >
                                <p className="whitespace-pre-wrap break-words">
                                  {message.message}
                                </p>
                                <span className="text-xs opacity-70 mt-1 block">
                                  {new Date(message.createdAt).toLocaleTimeString()}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div ref={messagesEndRef} />
                      </div>

                      <div className="p-4 border-t border-gray-200">
                        <form onSubmit={handleSend}>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              placeholder="Type your message..."
                              value={newMessage}
                              onChange={(e) => setNewMessage(e.target.value)}
                              className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button
                              type="submit"
                              className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
                            >
                              Send
                            </button>
                          </div>
                        </form>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-500">
                      <div className="text-center">
                        <MessageCircle size={48} className="mx-auto mb-4 opacity-50" />
                        <p>Select a conversation to start messaging</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage; 