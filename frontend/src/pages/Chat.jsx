import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { useLanguage } from '../context/LanguageContext';
import axios from 'axios';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { fetchUnreadCount } = useChat();
  const { t } = useLanguage();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/chat/messages', config);
      setMessages(data.data || []);
      fetchUnreadCount();
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    try {
      await axios.post('http://localhost:5000/api/chat/send', { message: newMessage }, config);
      setNewMessage('');
      fetchMessages();
      inputRef.current?.focus();
    } catch (error) {
      alert(t('error'));
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) return 'Hari ini';
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950">
        <div className="text-center">
          <div className="animate-pulse text-5xl mb-4">💬</div>
          <p className="text-gray-500 dark:text-gray-400">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-950">
      {/* Mini Navbar */}
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center gap-4 flex-shrink-0 shadow-sm">
        <Link 
          to="/" 
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition flex items-center gap-1 text-sm"
        >
          <span className="text-lg">←</span>
          <span className="hidden sm:inline">{t('back')}</span>
        </Link>
        
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            A
          </div>
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-white text-sm">Admin GypsumPro</h2>
            <p className="text-xs text-green-600 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full inline-block animate-pulse"></span>
              Online
            </p>
          </div>
        </div>

        <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full hidden sm:inline-block">
          Customer Service
        </span>
      </nav>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-gray-50 dark:bg-gray-900">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-400">
              <p className="text-6xl mb-3">💬</p>
              <p className="font-medium text-lg">{t('chat_no_messages')}</p>
              <p className="text-sm mt-2 max-w-xs mx-auto">
                Silakan kirim pesan, tim kami akan merespon secepatnya
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMe = msg.sender._id === user._id;
            const showDate = index === 0 || 
              new Date(msg.createdAt).toDateString() !== new Date(messages[index-1].createdAt).toDateString();
            
            return (
              <React.Fragment key={msg._id}>
                {showDate && (
                  <div className="flex justify-center my-2">
                    <span className="text-xs bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500 px-3 py-1 rounded-full shadow-sm">
                      {formatDate(msg.createdAt)}
                    </span>
                  </div>
                )}
                <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] sm:max-w-[70%]`}>
                    <div className={`px-4 py-2.5 rounded-2xl ${
                      isMe 
                        ? 'bg-blue-600 text-white rounded-br-md ml-auto' 
                        : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-md shadow-sm'
                    }`}>
                      {!isMe && (
                        <p className="text-xs font-semibold mb-0.5 opacity-60">Admin</p>
                      )}
                      <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                    </div>
                    <p className={`text-[10px] mt-0.5 text-gray-400 ${isMe ? 'text-right' : 'text-left'}`}>
                      {formatTime(msg.createdAt)}
                      {isMe && msg.isRead && ' ✓✓'}
                    </p>
                  </div>
                </div>
              </React.Fragment>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Info bar */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border-t border-yellow-200 dark:border-yellow-800 px-4 py-2 text-center flex-shrink-0">
        <p className="text-xs text-yellow-700 dark:text-yellow-400 flex items-center justify-center gap-1">
          <span>🕐</span>
          Balasan biasanya dalam beberapa menit di jam kerja (Senin-Jumat, 08:00-17:00 WIB)
        </p>
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-3 flex gap-2 flex-shrink-0">
        <input
          ref={inputRef}
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={t('chat_placeholder')}
          className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition"
          autoFocus
        />
        <button
          type="submit"
          disabled={!newMessage.trim()}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition font-medium text-sm flex items-center gap-1"
        >
          <span>✈️</span>
        </button>
      </form>
    </div>
  );
};

export default Chat;