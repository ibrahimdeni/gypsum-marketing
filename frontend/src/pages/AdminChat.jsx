import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useChat } from '../context/ChatContext';
import { useLanguage } from '../context/LanguageContext';
import axios from 'axios';

const AdminChat = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef(null);
  const { fetchUnreadCount } = useChat();
  const { t } = useLanguage();
  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchRooms();
    const interval = setInterval(fetchRooms, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedRoom) {
      fetchMessages(selectedRoom.user._id);
      const interval = setInterval(() => fetchMessages(selectedRoom.user._id), 3000);
      return () => clearInterval(interval);
    }
  }, [selectedRoom]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchRooms = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/chat/rooms', config);
      setRooms(data.data || []);
      fetchUnreadCount();
    } catch (error) { console.error('Error fetching rooms:', error); }
  };

  const fetchMessages = async (userId) => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/chat/messages?userId=${userId}`, config);
      setMessages(data.data || []);
    } catch (error) { console.error('Error fetching messages:', error); }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedRoom) return;
    try {
      await axios.post('http://localhost:5000/api/chat/send', { message: newMessage, receiverId: selectedRoom.user._id }, config);
      setNewMessage('');
      fetchMessages(selectedRoom.user._id);
      fetchRooms();
    } catch (error) { alert(t('error')); }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) return 'Hari ini';
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) return 'Kemarin';
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // Hitung total unread
  const totalUnread = rooms.reduce((sum, room) => sum + room.unreadCount, 0);

  return (
    <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      {/* Top Navbar */}
      <nav className="bg-gray-900 text-white px-4 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <Link to="/admin/dashboard" className="text-blue-400 hover:text-blue-300 transition flex items-center gap-1">
            ← <span className="hidden sm:inline">{t('nav_dashboard')}</span>
          </Link>
          <span className="text-gray-600">|</span>
          <h1 className="font-bold text-lg">💬 {t('nav_admin_chat')}</h1>
          {totalUnread > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{totalUnread} baru</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {/* Mobile toggle sidebar */}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden text-gray-300 hover:text-white"
          >
            {sidebarOpen ? '◁' : '▷'}
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Room List */}
        <div className={`${
          sidebarOpen ? 'w-80' : 'w-0'
        } md:w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300 overflow-hidden`}>
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="font-semibold text-gray-900 dark:text-white">Percakapan</h2>
            <p className="text-xs text-gray-500 mt-1">{rooms.length} percakapan</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            {rooms.length === 0 ? (
              <div className="text-center text-gray-400 py-12">
                <p className="text-4xl mb-2">📭</p>
                <p className="text-sm">Belum ada percakapan</p>
              </div>
            ) : (
              rooms.map((room) => (
                <button
                  key={room._id}
                  onClick={() => {
                    setSelectedRoom(room);
                    if (window.innerWidth < 768) setSidebarOpen(false);
                  }}
                  className={`w-full p-4 text-left border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition ${
                    selectedRoom?._id === room._id 
                      ? 'bg-blue-50 dark:bg-blue-900/30 border-l-4 border-l-blue-600' 
                      : 'border-l-4 border-l-transparent'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                      {room.user?.name?.charAt(0) || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                          {room.user?.name || 'Unknown'}
                        </p>
                        <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                          {formatDate(room.lastMessageDate)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{room.lastMessage || 'Belum ada pesan'}</p>
                      <p className="text-xs text-gray-400 truncate">{room.user?.email}</p>
                    </div>
                    {room.unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-xs min-w-[20px] h-5 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                        {room.unreadCount}
                      </span>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900">
          {selectedRoom ? (
            <>
              {/* Chat Header */}
              <div className="px-4 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3 flex-shrink-0">
                {/* Back button mobile */}
                <button 
                  onClick={() => setSidebarOpen(true)}
                  className="md:hidden text-gray-500 hover:text-gray-700"
                >
                  ←
                </button>
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  {selectedRoom.user?.name?.charAt(0) || '?'}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white">{selectedRoom.user?.name}</p>
                  <p className="text-xs text-gray-500">{selectedRoom.user?.email}</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-400 mt-20">
                    <p className="text-4xl mb-2">💬</p>
                    <p>Belum ada pesan</p>
                  </div>
                ) : (
                  messages.map((msg, index) => {
                    const isAdmin = msg.sender.role === 'admin';
                    // Tampilkan tanggal jika berbeda dengan pesan sebelumnya
                    const showDate = index === 0 || 
                      new Date(msg.createdAt).toDateString() !== new Date(messages[index-1].createdAt).toDateString();
                    
                    return (
                      <React.Fragment key={msg._id}>
                        {showDate && (
                          <div className="flex justify-center">
                            <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-3 py-1 rounded-full">
                              {formatDate(msg.createdAt)}
                            </span>
                          </div>
                        )}
                        <div className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] lg:max-w-[60%]`}>
                            <div className={`px-4 py-2.5 rounded-2xl shadow-sm ${
                              isAdmin 
                                ? 'bg-blue-600 text-white rounded-br-md' 
                                : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-md'
                            }`}>
                              <p className="text-xs font-semibold mb-0.5 opacity-75">{msg.sender.name}</p>
                              <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                            </div>
                            <p className={`text-[10px] mt-0.5 text-gray-400 ${isAdmin ? 'text-right' : 'text-left'}`}>
                              {formatTime(msg.createdAt)}
                              {isAdmin && msg.isRead && ' ✓✓'}
                            </p>
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSend} className="p-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex gap-2 flex-shrink-0">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Ketik balasan..."
                  className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium text-sm"
                >
                  Kirim
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <div className="text-center px-4">
                <p className="text-6xl mb-4">💬</p>
                <p className="text-xl font-medium text-gray-500">Pilih Percakapan</p>
                <p className="text-sm mt-2">Pilih customer dari daftar di sebelah kiri</p>
                {rooms.length === 0 && (
                  <p className="text-sm mt-4 text-gray-400">Belum ada customer yang mengirim pesan</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminChat;